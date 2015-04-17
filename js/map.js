
//------------World Map Object Function -------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------

WorldMap = function(_parentElement, _cdata, _capitals, alldata, _eventHandler) {

    this.parentElement = _parentElement;
    this.data = alldata;
    this.eventHandler = _eventHandler;
    this.width = getInnerWidth(this.parentElement);
    this.height = (this.width) / 2.15;
    this.cdata =_cdata
    this.ccapitals = _capitals
    this.arcdata = [
        {
            sourceLocation: [0, 0],
            targetLocation: [0, 0]
        }]


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


    this.heat_map = d3.scale.ordinal()
        .range(colorbrewer.Set3[7]);

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
        .style("fill", "steelblue")


    //Still working out what this is actually doing
    this.outterg = this.svg.append("g").attr("transform", "translate(" + (that.width-70) / 2 + "," + that.height / 2 + ")");

    this.g = this.outterg.append("g").attr("id", "innerg");

    //Makes the borders of the countries
    this.g.style("stroke-width", 1).attr("transform", "");

//pulling out the applicable topojson data and making the countries
    d3.json("data/world-topo-110m.json", function(error, world) {


        //Pulls out the individual countries features describing what arcs are needed to build the visual
        var topo = topojson.feature(world, world.objects.countries).features;

        //Preparing to build the countries
        that.country = d3.select("#innerg").selectAll(".country").data(topo);

        //I think it has to do with centering purposes...adjusting for any positioning of the div
        var offsetL = document.getElementById("world_map").offsetLeft;
        var offsetT = document.getElementById("world_map").offsetTop;




        //build the countries
        that.country.enter().append("path")
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
            .on("click", function (d) {
                $(that.eventHandler).trigger("selection", d.properties.name)
            })
            .on("mousemove", function (d, i) {

                d3.select(this).style("stroke", "red")
                var mouse = d3.mouse(that.svg.node()).map(function (d) {
                    return parseInt(d);
                });

                that.tooltip.classed("hidden", false)
                    .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT-25) + "px" )
                    .html(d.properties.name)

            })
            .on("mouseout", function (d, i) {
                d3.select(this).style("stroke", "#111")
                that.tooltip.classed("hidden", true);
            });


        that.updateVis();
    })


};

WorldMap.prototype.wrangleData = function(){}

WorldMap.prototype.updateVis = function(){

    //clear();
    that = this;




    //Update the colors on the the map depending on Selection of Radio Buttons..or have a function for each button...
    //Need to make a legend
    //var colors = d3.scale.quantize()   //Quantifies the size of colors
    //    .domain()
    //    .range(colorbrewer.Greens[7]);
    //
    //that.heat_map.domain(d3.extent(that.cdata, function(d) { return parseInt(d.gdp_md_est); }))
    //
    //that.country.style("fill", function(d,i){return that.heat_map(that.cdata[i].gdp_md_est)})




   //to draw out lines need to research d3.svg.line()

    //This works....
    //var arcs = this.svg.append("g")
    //    .attr("class","arcs")
    //    .attr("transform", "translate(" + (that.width-70) / 2 + "," + that.height / 2 + ")");
    //
    //
    //arcs.selectAll("path")
    //    .data(that.arcdata)
    //    .enter()
    //    .append("path")
    //    .attr('d', function(d) {
    //        return lngLatToArc(d, that.projection, 'sourceLocation', 'sourceLocation',.9); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
    //    }).transition().duration(2000)
    //    .attr('d', function(d) {
    //        return lngLatToArc(d, that.projection, 'sourceLocation', 'targetLocation',.9); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
    //    })
    //    .style("stroke", "#111")


    var arcs =this.svg.selectAll(".arcs").data(that.arcdata);

    arcs.enter().append("g")
            .attr("class","arcs")
            .attr("transform", "translate(" + (that.width-70) / 2 + "," + that.height / 2 + ")")
        .append("path")
        .attr("class", "arcs")

    arcs.attr('d', function(d) {
                return lngLatToArc( d, that.projection, 'sourceLocation', 'sourceLocation',.9); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
            }).transition().duration(2000)
            .attr('d', function(d) {
                return lngLatToArc(d, that.projection, 'sourceLocation', 'targetLocation',.9); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
            })
            .style("stroke", "#111")

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
    var oecd_main = ["Australia", "Austria", "Canada", "France","Germany", "Great Britain", "Greece", "Netherlands", "Norway", "United States" ]

    this.arcdata = [
        {
            sourceLocation: [0, 0],
            targetLocation: [0, 0]
        }]

    d3.json("data/capitals.json", function(cdata) {
        console.log(cdata)
        var source_lat, source_long
        var target_lat=0
        var target_long=0;
        for(z=0; z<oecd_main.length; z++ ) {
            for (i = 0; i < cdata.length; i++) {
                if (source_country == cdata[i]["country"]) {
                    source_lat = cdata[i]["lat"]
                    source_long = cdata[i]["lon"]
                }

                if (oecd_main[z] == cdata[i]["country"]) {
                    target_lat = cdata[i]["lat"]
                    target_long = cdata[i]["lon"]

                }
            }
            that.arcdata.push(
                {
                    sourceLocation: [source_long, source_lat],
                    targetLocation: [target_long, target_lat]
                });

        }

        //that.arcdata.splice(0,1)
        console.log(that.arcdata)
        that.updateVis()
    });
}


    WorldMap.prototype.heatmap = function(radio) {
        that = this;

console.log(that.data)
        if(d3.select(radio).attr("value") == "Migrant" && d3.select(radio).node().checked) {

            that.heat_map.domain([0, d3.max(that.data, function (d, i) {
                return parseInt(d.data._children[i].size);
            })])

            for (i = 0; i < 195; i++) {

                var total=0;
                that.data._children.map(function (d) {
                    console.log(d)
                    //total = total + d._children[i].size
                })

                //$('[title= ' + that.data._children[1]._children[i].name + ']').css("fill", function(){return that.heat_map(total)});
            }

            for (i = 0; i < 20; i++) {
                console.log("test")
                $('[title= ' + that.data._children[i].name + ']').css("fill", function(){console.log(that.heat_map(that.data._children[1].wage));return that.heat_map(that.data._children[1].wage)});
            }
        }

    };

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
        return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

    } else {
        return "M0,0,l0,0z";
    }
}

