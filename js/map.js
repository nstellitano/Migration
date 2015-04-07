

WorldMap = function(_parentElement, _cdata, _capitals) {

    this.parentElement = _parentElement;
    console.log(this.parentElement)
    this.width = getInnerWidth(this.parentElement) - 50;
    this.height = (this.width - 200) / 2;
    this.projection = d3.geo.mercator().translate([0, 0]).scale(this.width / 2 / Math.PI);
    this.path = d3.geo.path().projection(this.projection);
    this.cdata =_cdata
    this.ccapitals = _capitals



    this.tooltip = d3.select("body").append("div").attr("class", "tooltip hidden");

    this.initVis();


}

var getInnerWidth = function(element) {
    var style = window.getComputedStyle(element.node(), null);

    return parseInt(style.getPropertyValue('width'));
}

WorldMap.prototype.initVis = function(){

    that = this;


    this.svg = that.parentElement.append("svg")
        .attr("width", that.width)
        .attr("height", that.height);

    this.svg.append("rect")
        .attr("width", that.width)
        .attr("height", that.height)
        .style("fill", "steelblue")
//            .on("click", loadworldmap);

    this.outterg = this.svg.append("g").attr("transform", "translate(" + (that.width-70) / 2 + "," + that.height / 2 + ")");

    this.g = this.outterg.append("g").attr("id", "innerg");

    this.updateVis();
};

WorldMap.prototype.wrangleData = function(){}

WorldMap.prototype.updateVis = function(){

    clear();
    that = this;
    this.g.style("stroke-width", 1).attr("transform", "");

    d3.json("data/world-topo-110m.json", function(error, world) {


        var topo = topojson.feature(world, world.objects.countries).features;

        var country = d3.select("#innerg").selectAll(".country").data(topo);

        //ofsets
        var offsetL = document.getElementsByClassName(that.parentElement).offsetLeft;
        var offsetT =document.getElementsByClassName(that.parentElement).offsetTop;

        country.enter().append("path")
            .attr("class", "country")
            .attr("d", that.path)
            .attr("id", function(d,i) { return d.id; })
            .attr("title", function(d,i) { return d.properties.name; })
            .style("fill","#ccc")
            .style("stroke", "#111")
            .on("click", click)
            .on("mousemove", function(d,i) {
                var mouse = d3.mouse(that.svg.node()).map( function(d) { return parseInt(d); } );
                that.tooltip.classed("hidden", false)
                    .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
                    .html(d.properties.name);
            })
            .on("mouseout",  function(d,i) {
                that.tooltip.classed("hidden", true);
            });

})};





function click(d) {
console.log("Update Graphs")
    console.log(d)
    d.classed("highlight", true)

}



function clear(){
    d3.selectAll("path").remove();
    d3.selectAll("circle").remove();
    d3.selectAll("text").remove();
}

