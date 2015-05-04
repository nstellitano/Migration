
//------------World Map Object Function -------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------

WorldMap = function(_parentElement, _cdata, _capitals, alldata, _eventHandler, topo,_1980, _1985, _1990, _1995, _2000, _2005, _2010) {

    that = this;
    this.parentElement = _parentElement;
    this.data = alldata;
    this.eventHandler = _eventHandler;
    this.width = getInnerWidth(this.parentElement);
    this.height = (this.width) / 2.15;
    this.topo = topo
    this.cdata =_cdata
    this.ccapitals = _capitals
    this.arcdata = [
        {
            sourceLocation: [0, 0],
            targetLocation: [0, 0]
        }]
    that.d1980 = _1980;
    that.d1985 = _1985;
    that.d1990 = _1990;
    that.d1995 = _1995;
    that.d2000 = _2000;
    that.d2005 = _2005;
    that.d2010 = _2010;



    //Map Required Calculations
    this.projection = d3.geo.mercator()
        .translate([0, 0])
        .scale(this.width / 2 / Math.PI)
        .center([0, 5 ])
        //.rotate([-180,0]);

    //Will be used to build each individual country
    this.path = d3.geo.path().projection(this.projection);



    //To show country names when hovering over the country
    this.tooltip = d3.select("body").append("div").attr("class", "tooltip hidden");


    this.heat_map = d3.scale.quantize()
        .range(colorbrewer.Reds[9])

    this.heat_map_oecd = d3.scale.quantize()
        .range(colorbrewer.Reds[9]).domain([0, 6000000]);

    this.heat_map_nonoecd = d3.scale.quantize()
        .range(colorbrewer.PuBu[9]).domain([-3000000, 0]);


        this.initVis();



}


WorldMap.prototype.initVis = function(){

    that = this;

    //Create SVG of the overall map
    this.svg = that.parentElement.append("svg")
        .attr("width", that.width)
        .attr("height", that.height);

    //Create a giant rectangle that will encompass the map (filled by sea)
    this.svg.append("rect")
        .attr("width", that.width)
        .attr("height", that.height)
        .style("fill", "#bce8f1")


    //Still working out what this is actually doing
    this.outterg = this.svg.append("g").attr("transform", "translate(" + (that.width-70) / 2 + "," + that.height / 2 + ")");

    this.g = this.outterg.append("g").attr("id", "innerg");

    //Makes the borders of the countries
    this.g.style("stroke-width", 1).attr("transform", "");


        //Pulls out the individual countries features describing what arcs are needed to build the visual
        this.topon = topojson.feature(that.topo, that.topo.objects.countries).features;

        //Preparing to build the countries
        this.country = d3.select("#innerg").selectAll(".country").data(that.topon);

        //I think it has to do with centering purposes...adjusting for any positioning of the div
        var offsetL = document.getElementById("world_map").offsetLeft;
        var offsetT = document.getElementById("world_map").offsetTop;




        //build the countries
        this.country.enter().append("path")
            .attr("class", "country")
            .attr("d", that.path)
            .attr("id", function (d, i) {
                return d.id;
            })
            .attr("title", function (d, i) {
                return d.properties.name;
            })
            .style("fill", "#ccc")
            .style("stroke", "#111")

            this.country.on("click", function (d) {
                $(that.eventHandler).trigger("map_selection", [d.properties.name])

            })
            .on("mousemove", function (d, i) {

                //d3.select(this).style("stroke", "red")
                //d.classed("country_hidden", true)
                var mouse = d3.mouse(that.svg.node()).map(function (d) {
                    return parseInt(d);
                });

                that.tooltip.classed("hidden", false)
                    .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT-25) + "px" )
                    .html(that.topon[i].properties.name)


            })
            .on("mouseout", function (d, i) {
                //d3.select(this).style("stroke", "#111")
                that.tooltip.classed("hidden", true);
                //d.classed("country_hidden", false)
            });


        that.updateVis();



};

WorldMap.prototype.wrangleData = function(){}

WorldMap.prototype.updateVis = function(){

    //clear();
    that = this;


   //to draw out lines need to research d3.svg.line()
   //

    var arcs =this.svg.selectAll(".arcs").data(that.arcdata);

    arcs.enter().append("g")
            .attr("class","arcs")
            .attr("transform", "translate(" + (that.width-70) / 2 + "," + that.height / 2 + ")")
        .append("path")
        .attr("class", "arcs")

    arcs.attr('d', function(d,i) {
        return lngLatToArc( d, that.projection, 'sourceLocation', 'sourceLocation',.9); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
            }).transition().duration(2000)
            .attr('d', function(d) {
            })
            .style("stroke", "black")


    arcs.exit().remove()




    //Zoom and scroll of the map.  Need to integrate the arcs if we want to have them move too
    //var zoom = d3.behavior.zoom()
    //    .on("zoom",function() {
    //        that.country.attr("transform","translate("+
    //        d3.event.translate.join(",")+")scale("+d3.event.scale+")");
    //        that.country.selectAll("path")
    //            .attr("d", that.path.projection(that.projection));
    //
    //
    //    });
    //that.svg.call(zoom)
};


WorldMap.prototype.filter = function(){
    //filter what data we want to display via the heat map.
}

WorldMap.prototype.draw_arcData = function(source_country){
    //Filter out the OECD country or NON OECD country and their "targets" or "sources"

    that = this;
    var oecd_main = {"name": "Mexico"};



    that.arcdata = [
        {
            sourceLocation: [0, 0],
            targetLocation: [0, 0]
        }]


    var source_lat = 0
    var source_long = 0;
        var target_lat=0
        var target_long=0;

        for(z=0; z<1; z++ ) {
            for (i = 0; i < 241; i++) {
                if (source_country == that.ccapitals[i]["country"]) {
                    source_lat = that.ccapitals[i]["lat"]
                    source_long = that.ccapitals[i]["lon"]
                }

                if (oecd_main.name == that.ccapitals[i]["country"]) {
                    target_lat = that.ccapitals[i]["lat"]
                    target_long = that.ccapitals[i]["lon"]

                }
            }

            that.arcdata.push(
                {
                    sourceLocation: [source_long, source_lat],
                    targetLocation: [target_long, target_lat]
                });

        }

        that.arcdata.splice(0,1)


        that.updateVis()

}


    WorldMap.prototype.heatmap = function() {
        that = this;


        var min, max, test, range=[0,2], range1 = [0,2];



        if(document.getElementById("Migrant").checked) {


            var slider_year = 1980
            var slider = document.getElementsByName("slider-time")
            for(i=0; i< slider.length; i++){
                if(slider[i].checked){
                    slider_year = parseInt(slider[i].value)
                }
            }


            if(slider_year == "1980")
            {
                that.data = that.d1980;
            }

            if(slider_year == "1985")
            {
                that.data = that.d1985;
            }

            if(slider_year == "1990")
            {
                that.data = that.d1990;
            }

            if(slider_year == "1995")
            {
                that.data = that.d1995;
            }

            if(slider_year == "2000")
            {
                that.data = that.d2000;

            }

            if(slider_year == "2005")
            {
                that.data = that.d2005;
            }

            if(slider_year == "2010")
            {
                that.data = that.d2005;
            }

            test = 0;
            range1 = [-3000000, 0]

            range  = [0, 6000000]






            for (i = 0; i < 195; i++) {

                var total=0;
                that.data._children.map(function (d) {

                    total = total + d._children[i].size
                })


                $('[title="' + String(that.data._children[1]._children[i].name) + '"]').css("fill", function(){return that.heat_map_nonoecd(-1*total)});
                if(total*-1 <min){min = -1*total};


                //Need to subtract out outflows of OECD countries
                for(z = 0; z<20; z++){
                    if(total>max){max =that.data._children[z].size-total}
                    if(that.data._children[z].name == that.data._children[1]._children[i].name) {
                        $('[title="' + String(that.data._children[1]._children[i].name) + '"]').css("fill", function(){return that.heat_map_oecd(that.data._children[z].size - total)});


                    }
                }



            }


        }






        if(document.getElementById("Wage").checked) {

            that.data = that.d2010


            test = 1;
            var wage_table = {"name": [], "TypeI": [], "TypeII": [], "TypeIII": [], "Avg": []}
            var counter = 0;

            for (i = 0; i < 195; i++) {


                $('[title="' + String(that.data._children[1]._children[i].name) + '"]').css("fill", function(){ return "grey"});



                if (that.data._children[0]._children[i].wage_diffI > 0) {
                    wage_table.name[counter] = that.data._children[0]._children[i].name
                    wage_table.TypeI[counter] = that.data._children[0].wageI - that.data._children[1]._children[i].wage_diffI
                    wage_table.TypeII[counter] = that.data._children[0].wageII - that.data._children[1]._children[i].wage_diffII
                    wage_table.TypeIII[counter] = that.data._children[0].wageIII - that.data._children[1]._children[i].wage_diffIII
                    counter = counter + 1
                }
            }

            that.data._children.map(function (d) {

                if (d.wageI > 0) {
                    wage_table.name[counter] = d.name;
                    wage_table.TypeI[counter] = parseInt(d.wageI);
                    wage_table.TypeII[counter] = parseInt(d.wageII);
                    wage_table.TypeIII[counter] = parseInt(d.wageIII);
                    counter = counter + 1;

                }
            });


            for (i = 0; i < wage_table.name.length; i++) {

                wage_table.Avg[i] = (wage_table.TypeI[i] + wage_table.TypeII[i] + wage_table.TypeIII[i]) / 3;
            }


            range = d3.extent(wage_table.Avg, function (d) {
                return d
            });

            that.heat_map.domain(range)


            for (i = 0; i < wage_table.name.length; i++) {

                $('[title="' + String(wage_table.name[i]) + '"]').css("fill", function () {
                     return that.heat_map(wage_table.Avg[i])
                });
            }


        }

        min = range[0] || 0;
        max = range[1] || 2;

        min1 = range1[0] || 0;
        max1 = range1[1] || 2;

            that.legend(min, max, min1, max1, test);
        };





WorldMap.prototype.legend = function(min, max, min1, max1, test) {




    var startValue = min;
    var endValue = max;
    var nElements = 9;
    var stepSize = (endValue-startValue)/(nElements-1) -2;
    var color_data =  []


    for (var i = startValue+3; i <= endValue; i=i+stepSize) {
        color_data.push(i);
    }
    var startValue1 = min1;
    var endValue1 = max1;
    var nElements1 = 9;
    var stepSize1 = (endValue1-startValue1)/(nElements1-1) -2;
    var color_data1 =  []

    if(test==0){for (var i = startValue1+3; i <= endValue1; i=i+stepSize1) {
        color_data1.push(i);
    }}else (color_data1 = 0)




    var legend = this.svg.selectAll(".legend")
        .data(color_data, function(d){ return d})

    legend.enter()
        .append("g")
        .attr("class", "legend")

    legend.exit().remove()

    var rect = legend.selectAll(".rect")
        .data(function(d) {return [d]})

    rect.enter().append("rect").attr("class", "rect");

    var count = 8
    rect.attr("x", function(d, i){return 10 ; } )
        .attr("y", function(d,i) {count--; return count*20 +250})
        .attr("width", function(d,i) {return 20})
        .attr("height", 20)
        .attr("fill", function(d,i){if (test == 1){return that.heat_map(d)} else {return that.heat_map_oecd(d)}})

    rect.exit()
        .remove()


        var legend1 = this.svg.selectAll(".legend1")
            .data(color_data1, function(d){ return d})

        legend1.enter()
            .append("g")
            .attr("class", "legend1")

        legend1.exit().remove()

        var rect1 = legend1.selectAll(".rect1")
            .data(function(d) {return [d]})

        rect1.enter().append("rect").attr("class", "rect1");

        var count1 = 0
        rect1.attr("x", function(d, i){return 90 ; } )
            .attr("y", function(d,i) { count1++; return count1*20 +210})
            .attr("width", function(d,i) {return 20})
            .attr("height", 20)
            .attr("fill", function(d,i){return that.heat_map_nonoecd(d)})

        rect1.exit()
            .remove()




    var label = legend.selectAll(".text1")
        .data(function(d){return[d]})

    label.enter().append("text").attr("class", "text1")

    count =8;
    label
        .attr("x", function(d, i){return 35 ; } )
        .attr("y", function(d,i) {count--; return count*20 +258})
        .attr("font-size", "9px")
        .attr("font-family", "Lato")
         .attr("dy", ".35em")
         .text(function(d) { if(test ==1){return "< $" +  Math.round(d);} else {return "> " + Math.round(d+13)} });

    label.exit()
        .remove();


        var label1 = legend1.selectAll(".text1")
            .data(function(d){return[d]})

        label1.enter().append("text").attr("class", "text1")

        count1 =8;
        label1
            .attr("x", function(d, i){return 115 ; } )
            .attr("y", function(d,i) {count1--; return count1*20 +258})
            .attr("font-size", "9px")
            .attr("font-family", "Lato")
            //.attr("dy", ".35em")
            .text(function(d) { return "< " + Math.round(-1*(d-3)); });

        label1.exit()
            .remove();


    if(test == 1) {var label2 = legend.selectAll(".text2")
        .data(function(d){return[d]})}
    else {var label2 = legend1.selectAll(".text2")
        .data(function(d){return[d]})}

    label2.enter().append("text").attr("class", "text2")


    label2
        .attr("x", function(d, i){return 0 ; } )
        .attr("y", function(d,i) { return 218})
        .attr("font-size", "10px")
        .attr("font-family", "Lato")
        //.attr("dy", ".35em")
        .text(function(d) {if(test == 1){return "Annual Avg Wage"} else {return "Outflows vs Inflows of Migrant Stock" }});

    label2.exit()
        .remove();



}


//------------Helper Functions-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------



var getInnerWidth = function(element) {
    var style = window.getComputedStyle(element.node(), null);

    return parseInt(style.getPropertyValue('width'));
}

function clear(){
    d3.selectAll("path").remove();
    d3.selectAll("circle").remove();
    d3.selectAll("text").remove()
    d3.selectAll("arcs").remove();
}

// This function takes an object, the key names where it will find an array of lng/lat pairs, e.g. `[-74, 40]`
// And a bend parameter for how much bend you want in your arcs, the higher the number, the less bend.
function lngLatToArc(d, projection, sourceName, targetName, bend){
    // If no bend is supplied, then do the plain square root
    bend = bend || 1;
    // `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
    // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

    var sourceLngLat = d[sourceName],
        targetLngLat = d[targetName];


    if (targetLngLat && sourceLngLat) {

        var sourceXY = projection( sourceLngLat ),
            targetXY = projection( targetLngLat );

        // Uncomment this for testing, useful to see if you have any null lng/lat values
        // if (!targetXY) console.log(d, targetLngLat, targetXY)
        var sourceX = sourceXY[0],
            sourceY = sourceXY[1];

        var targetX = targetXY[0],
            targetY = targetXY[1];

        var dx = targetX - sourceX,
            dy = targetY - sourceY,
            dr = Math.sqrt(dx * dx + dy * dy)*bend;

        // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
        var west_of_source = (targetX - sourceX) < 0;
        if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
        return  "M"+sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

    } else {
        return "M0,0,l0,0z";
    }
}


