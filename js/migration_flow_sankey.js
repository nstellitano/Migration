

sankey_chart = function(parent_element)
{
    that = this;
    var units = "Migrants";
    //var slider_year = parseInt(d3.select("#slider-time").property("value"));
    //document.getElementById("year").innerHTML = slider_year.toString();

    this.margin = {top: 10, right: 10, bottom: 10, left: 10}
    this.width = 1100 - that.margin.left - that.margin.right
    this.height = 700 - that.margin.top - that.margin.bottom;

    this.formatNumber = d3.format(",.0f");  // zero decimal places
      this.format = function (d) {
            return that.formatNumber(d) + " " + units;
        },
        color = d3.scale.category20();

    // append the svg canvas to the page
    this.svg = parent_element.append("svg")
        .attr("width", that.width + that.margin.left + that.margin.right)
        .attr("height", that.height +1000+ that.margin.top + that.margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + that.margin.left + "," + that.margin.top + ")");

    // Set the sankey diagram properties
    this.sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(40)
        .size([that.width, that.height]);

    this.path = this.sankey.link();

    this.graph =0;

    this.initVis()
}

sankey_chart.prototype.initVis = function() {

    that = this;

    var _1980, _1985, _1990, _1995, _2000, _2005, _2010;
    queue()
        .defer(d3.json, "data/sankey_1980.json")
        .defer(d3.json, "data/sankey_1985.json")
        .defer(d3.json, "data/sankey_1990.json")
        .defer(d3.json, "data/sankey_1995.json")
        .defer(d3.json, "data/sankey_2000.json")
        .defer(d3.json, "data/sankey_2005.json")
        .defer(d3.json, "data/sankey_2010.json")
        .defer(d3.json, "data/sankey_1980_oecd.json")
        .defer(d3.json, "data/sankey_1985_oecd.json")
        .defer(d3.json, "data/sankey_1990_oecd.json")
        .defer(d3.json, "data/sankey_1995_oecd.json")
        .defer(d3.json, "data/sankey_2000_oecd.json")
        .defer(d3.json, "data/sankey_2005_oecd.json")
        .defer(d3.json, "data/sankey_2010_oecd.json")
        .await(ready);

    function ready(error, d_1980, d_1985, d_1990, d_1995, d_2000, d_2005, d_2010, oecd_1980,oecd_1985,oecd_1990,oecd_1995,oecd_2000,oecd_2005, oecd_2010) {
        that._1980 = JSON.parse(JSON.stringify(d_1980, null, 1));
        that._1985 = JSON.parse(JSON.stringify(d_1985, null, 1));
        that._1990 = JSON.parse(JSON.stringify(d_1990, null, 1));
        that._1995 = JSON.parse(JSON.stringify(d_1995, null, 1));
        that._2000 = JSON.parse(JSON.stringify(d_2000, null, 1));
        that._2005 = JSON.parse(JSON.stringify(d_2005, null, 1));
        that._2010 = JSON.parse(JSON.stringify(d_2010, null, 1));
        that.oecd_1980 = JSON.parse(JSON.stringify(oecd_1980, null, 1));
        that.oecd_1985 = JSON.parse(JSON.stringify(oecd_1985, null, 1));
        that.oecd_1990 = JSON.parse(JSON.stringify(oecd_1990, null, 1));
        that.oecd_1995 = JSON.parse(JSON.stringify(oecd_1995, null, 1));
        that.oecd_2000 = JSON.parse(JSON.stringify(oecd_2000, null, 1));
        that.oecd_2005 = JSON.parse(JSON.stringify(oecd_2005, null, 1));
        that.oecd_2010 = JSON.parse(JSON.stringify(oecd_2010, null, 1));


        _1980 = JSON.parse(JSON.stringify(that._1980, null, 1));
        var nodeMap = {};
        _1980.nodes.forEach(function (x) {
            nodeMap[x.name] = x;
        });
        _1980.links = _1980.links.map(function (x) {
            return {
                source: nodeMap[x.source],
                target: nodeMap[x.target],
                value: x.value
            };
        });

        that.sankey
            .nodes(_1980.nodes)
            .links(_1980.links)
            .layout(32);


        that.graph = _1980;


        that.chart();
    }
}

    sankey_chart.prototype.chart = function()  {
that = this;

        d3.selectAll(".node").remove()
        d3.selectAll(".link").remove()


// add in the links
        var link = this.svg.append("g").selectAll(".link")
            .data(that.graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", that.path)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
        link.append("title")
            .text(function(d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + that.format(d.value); });

// add in the nodes
        var node = that.svg.append("g").selectAll(".node")
            .data(that.graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.behavior.drag()
                .origin(function(d) { return d; })
                .on("dragstart", function() {console.log(this.parentNode);
                    this.parentNode.appendChild(this); })
                .on("drag", dragmove));

// add the rectangles for the nodes
        node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", that.sankey.nodeWidth())
            .style("fill", function(d) {
                return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) {
                return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + that.format(d.value); });

// add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x < that.width / 2; })
            .attr("x", 6 + that.sankey.nodeWidth())
            .attr("text-anchor", "start");

        var testing = that;
// the function for moving the nodes
        function dragmove(d) {

            d3.select(this).attr("transform",
                "translate(" + (
                    d.x = Math.max(0, Math.min(testing.width - d.dx, d3.event.x))
                ) + "," + (
                    d.y = Math.max(0, Math.min(testing.height - d.dy, d3.event.y))
                ) + ")");
             testing.sankey.relayout();
            link.attr("d", testing.path);
        }



        };






sankey_chart.prototype.update = function(){

    that = this;

    var slider_year = 1980
    var slider = document.getElementsByName("slider-time")
    for(i=0; i< slider.length; i++){
        if(slider[i].checked){
            slider_year = parseInt(slider[i].value)
        }
    }


    if(document.getElementById("sankey_oecd").checked){
        that.height = 1500;
        that.sankey.size([that.width, that.height]);
    }else {

        that.height = 700;
        that.sankey.size([that.width, that.height]);}

        if (slider_year == "1980") {
            if(document.getElementById("sankey_oecd").checked){_1980 = JSON.parse(JSON.stringify(that.oecd_1980, null, 1));}
            else{ _1980 = JSON.parse(JSON.stringify(that._1980, null, 1))}
            var nodeMap = {};
            _1980.nodes.forEach(function (x) {
                nodeMap[x.name] = x;
            });
            _1980.links = _1980.links.map(function (x) {
                return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: x.value
                };
            });

            that.sankey
                .nodes(_1980.nodes)
                .links(_1980.links)
                .layout(32);

            that.graph = _1980

        }
        if (slider_year == "1985") {

            if(document.getElementById("sankey_oecd").checked){_1985 = JSON.parse(JSON.stringify(that.oecd_1985, null, 1));}
            else{ _1985 = JSON.parse(JSON.stringify(that._1985, null, 1))}


            var nodeMap = {};
            _1985.nodes.forEach(function (x) {
                nodeMap[x.name] = x;
            });
            _1985.links = _1985.links.map(function (x) {
                return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: x.value
                };
            });

            that.sankey
                .nodes(_1985.nodes)
                .links(_1985.links)
                .layout(32);

            that.graph = _1985

        }

        if (slider_year == "1990") {
            if(document.getElementById("sankey_oecd").checked){_1990 = JSON.parse(JSON.stringify(that.oecd_1990, null, 1));}
            else{ _1990 = JSON.parse(JSON.stringify(that._1990, null, 1))}

            var nodeMap = {};
            _1990.nodes.forEach(function (x) {
                nodeMap[x.name] = x;
            });
            _1990.links = _1990.links.map(function (x) {
                return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: x.value
                };
            });

            that.sankey
                .nodes(_1990.nodes)
                .links(_1990.links)
                .layout(32);

            that.graph = _1990

        }

        if (slider_year == "1995") {
            if(document.getElementById("sankey_oecd").checked){_1995 = JSON.parse(JSON.stringify(that.oecd_1995, null, 1));}
            else{ _1995 = JSON.parse(JSON.stringify(that._1995, null, 1))}

            var nodeMap = {};
            _1995.nodes.forEach(function (x) {
                nodeMap[x.name] = x;
            });
            _1995.links = _1995.links.map(function (x) {
                return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: x.value
                };
            });

            that.sankey
                .nodes(_1995.nodes)
                .links(_1995.links)
                .layout(32);

            that.graph = _1995

        }
        if (slider_year == "2000") {
            if(document.getElementById("sankey_oecd").checked){_2000 = JSON.parse(JSON.stringify(that.oecd_2000, null, 1));}
            else{ _2000 = JSON.parse(JSON.stringify(that._2000, null, 1))}

            var nodeMap = {};
            _2000.nodes.forEach(function (x) {
                nodeMap[x.name] = x;
            });
            _2000.links = _2000.links.map(function (x) {
                return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: x.value
                };
            });

            that.sankey
                .nodes(_2000.nodes)
                .links(_2000.links)
                .layout(32);

            that.graph = _2000

        }

        if (slider_year == "2005") {
            if(document.getElementById("sankey_oecd").checked){_2005 = JSON.parse(JSON.stringify(that.oecd_2005, null, 1));}
            else{ _2005 = JSON.parse(JSON.stringify(that._2005, null, 1))}


            var nodeMap = {};
            _2005.nodes.forEach(function (x) {
                nodeMap[x.name] = x;
            });
            _2005.links = _2005.links.map(function (x) {
                return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: x.value
                };
            });

            that.sankey
                .nodes(_2005.nodes)
                .links(_2005.links)
                .layout(32);

            that.graph = _2005

        }
        if (slider_year == "2010") {
            if(document.getElementById("sankey_oecd").checked){_2010 = JSON.parse(JSON.stringify(that.oecd_2010, null, 1));}
            else{ _2010 = JSON.parse(JSON.stringify(that._2010, null, 1))}

            var nodeMap = {};
            _2010.nodes.forEach(function (x) {
                nodeMap[x.name] = x;
            });
            _2010.links = _2010.links.map(function (x) {
                return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: x.value
                };
            });

            that.sankey
                .nodes(_2010.nodes)
                .links(_2010.links)
                .layout(32);

            that.graph = _2010

        }



        this.chart()



}

