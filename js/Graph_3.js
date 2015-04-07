

function setup(width,height) {

    projection = d3.geo.mercator().translate([0, 0]).scale(width / 2 / Math.PI);

    path = d3.geo.path().projection(projection);

    console.log(projection)

    svg = d3.select("#container").append("svg")
            .attr("width", width)
            .attr("height", height);

    svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "steelblue")
//            .on("click", loadworldmap);

    var outterg = svg.append("g").attr("transform", "translate(" + (width-70) / 2 + "," + height / 2 + ")");

    g = outterg.append("g").attr("id", "innerg");
}



function ready(error, countries, capitals) {
    cdata = countries;
    ccapitals = capitals;


    loadworldmap();

};

function loadworldmap() {

    clear();
    g.style("stroke-width", 1).attr("transform", "");

    d3.json("data/world-topo-110m.json", function(error, world) {


        var topo = topojson.feature(world, world.objects.countries).features;

        var country = d3.select("#innerg").selectAll(".country").data(topo);

        //ofsets
        var offsetL = document.getElementById('container').offsetLeft;
        var offsetT =document.getElementById('container').offsetTop;

        country.enter().append("path")
                .attr("class", "country")
                .attr("d", path)
                .attr("id", function(d,i) { return d.id; })
                .attr("title", function(d,i) { return d.properties.name; })
                .style("fill","#ccc")
                .style("stroke", "#111")
                    .on("click", click)
                    .on("mousemove", function(d,i) {
                    var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                        tooltip.classed("hidden", false)
                                .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
                                .html(d.properties.name);
                    })
                    .on("mouseout",  function(d,i) {
                        tooltip.classed("hidden", true);
                    });

    });

}

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

