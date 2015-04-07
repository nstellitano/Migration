
//------------World Map Object Function -------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------

WorldMap = function(_parentElement, _cdata, _capitals, _eventHandler) {

    this.parentElement = _parentElement;
    this.eventHandler = _eventHandler;
    this.width = getInnerWidth(this.parentElement) - 50;
    this.height = (this.width - 200) / 2;
    this.cdata =_cdata
    this.ccapitals = _capitals


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
    console.log(this.tooltip)


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
        var country = d3.select("#innerg").selectAll(".country").data(topo);

        //I think it has to do with centering purposes...adjusting for any positioning of the div
        var offsetL = document.getElementsByClassName(that.parentElement).offsetLeft;
        var offsetT = document.getElementsByClassName(that.parentElement).offsetTop;

        //build the countries
        country.enter().append("path")
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
                var mouse = d3.mouse(that.svg.node()).map(function (d) {
                    return parseInt(d);
                });
                that.tooltip.classed("hidden", false)
                    .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
                    .html(d.properties.name);
            })
            .on("mouseout", function (d, i) {
                d3.select(this).style("fill", "#ccc")
                that.tooltip.classed("hidden", true);
            });
    })

    this.updateVis();
};

WorldMap.prototype.wrangleData = function(){}

WorldMap.prototype.updateVis = function(){

    clear();
    that = this;


        var zoom = d3.behavior.zoom()
            .on("zoom",function() {
                country.attr("transform","translate("+
                d3.event.translate.join(",")+")scale("+d3.event.scale+")");
                country.selectAll("path")
                    .attr("d", that.path.projection(projection));
            });

        that.svg.call(zoom)



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
    d3.selectAll("text").remove();
}

