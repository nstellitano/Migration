
//------------World Map Object Function -------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------

WorldMap = function(_parentElement, _cdata, _capitals, _eventHandler) {

    this.parentElement = _parentElement;
    this.eventHandler = _eventHandler;
    this.width = getInnerWidth(this.parentElement) - 50;
    this.height = (this.width) / 2;
    this.cdata =_cdata
    this.ccapitals = _capitals
    this.arcdata


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
        .range(colorbrewer.Set2[7]);

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
        var offsetL = document.getElementsByClassName(that.parentElement).offsetLeft;
        var offsetT = document.getElementsByClassName(that.parentElement).offsetTop;




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

                d3.select(this).style("fill", "black")
                var mouse = d3.mouse(that.svg.node()).map(function (d) {console.log(d);
                    return parseInt(d);
                });
                console.log(mouse[0] + offsetL)
                that.tooltip.classed("hidden", false)
                    .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
                    .html(d.properties.name)

            })
            .on("mouseout", function (d, i) {
                d3.select(this).style("fill", "#ccc")
                that.tooltip.classed("hidden", true);
            });
        console.log(that.country)

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

    var arcs = this.svg.append("g")
        .attr("class","arcs")
        .attr("transform", "translate(" + (that.width-70) / 2 + "," + that.height / 2 + ")");


    arcs.selectAll("path")
        .data(arcdata)
        .enter()
        .append("path")
        .attr('d', function(d) {
            return lngLatToArc(d, that.projection, 'sourceLocation', 'sourceLocation',.9); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
        }).transition().duration(2000)
        .attr('d', function(d) {
            return lngLatToArc(d, that.projection, 'sourceLocation', 'targetLocation',.9); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
        })
        .style("stroke", "#111")



    //Zoom and scroll of the map.  Need to integrate the arcs if we want to have them move too
    var zoom = d3.behavior.zoom()
        .on("zoom",function() {
            that.country.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
            that.country.selectAll("path")
                .attr("d", that.path.projection(that.projection));


        });
    that.svg.call(zoom)
};


WorldMap.prototype.filter = function(){
    //filter what data we want to display via the heat map.
}

WorldMap.prototype.arcData = function(){
    //Filter out the OECD country or NON OECD country and their "targets" or "sources"
}

WorldMap.prototype.HM_migration = function(){
    that = this;
    this.heat_map.domain(d3.extent(this.cdata, function(d) { return parseInt(d.gdp_md_est); }))

    this.country.transition().duration(1300).style("fill", function(d,i){return that.heat_map(that.cdata[i].gdp_md_est)})
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
        return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

    } else {
        return "M0,0,l0,0z";
    }
}

var arcdata = [
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-106.503961875, 33.051502817366334]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-97.27544625, 34.29490081496779]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-92.793024375, 34.837711658059135]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-100.3076728125, 41.85852354782116]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-104.6143134375, 43.18636214435451]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-106.152399375, 45.57291634897]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-105.5811103125, 42.3800618087319]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-74.610651328125, 42.160561343227656]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-78.148248984375, 40.20112201100485]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-81.795709921875, 39.89836713516883]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-91.738336875, 42.1320516230261]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-93.902643515625, 39.89836713516886]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-146.68645699218752, 62.84587613514389]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-151.03704292968752, 62.3197734579205]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-150.50969917968752, 68.0575087745829]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-155.58278180000002, 19.896766200000002]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-155.41249371406252, 19.355435189875685]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-156.22204876777346, 20.77817385333129]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-156.08334637519533, 20.781383752662176]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-119.41793240000001, 36.77826099999999]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-111.73848904062501, 34.311442605956636]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-118.62691677500001, 39.80409417718468]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-115.56173122812501, 44.531552843807575]
    },
    {
        sourceLocation: [-99.5606025, 41.068178502813595],
        targetLocation: [-107.13521755625001, 43.90164233696157]
    }
]