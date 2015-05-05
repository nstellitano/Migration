/**
 * Created by samikadhikari on 4/16/15.
 */


//This file creates the scatter plot with avg wage differential on the y axis and total stock of migrants in the x axis


ScatterVis = function(_parentElement, _alldata, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _alldata;
    this.displayData = [];
    this.eventHandler = _eventHandler;


    this.width = getInnerWidth(this.parentElement)
    this.height = (this.width) / 2.4

    //To show country names when hovering over the country
    this.tooltip_nonoecd = d3.select("body").append("div").attr("class", "tooltip hidden");

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
ScatterVis.prototype.initVis = function(){

    var that = this; // read about the this

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("class", "graph")

    this.x = d3.scale.linear()
        .range([54, this.width-30]);

    this.y = d3.scale.linear()
        .range([this.height-20,20]);


    this.color = d3.scale.category10();

    this.color_hash = {  0 : ["No Education", "Black"],
        1 : ["Secondary Education", "Red"],
        2 : ["Post-Secondary Education", "Green"]
    }

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .ticks(5)
        .orient("left");

    this.brush = this.svg.append("g")
        .attr("class", "brush")


        //.on("brush", brushmove);
            //$(that.eventHandler).trigger("selectionChanged",that.brush.extent());






    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(54,0)")
        .style("font-size", "13px")
        .style("font-family", "Lato")
       // .style("font-size", "10px")
       // .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height/1.06 + ")")
        .style("font-size", "13px")
        .style("font-family", "Lato")
       // .style("font-size", "10px")
       // .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})



    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
ScatterVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};


}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
ScatterVis.prototype.updateVis = function(){

    var that = this;


    // updates scales

    this.x.domain([0,d3.max(that.displayData.size_low) + 40000]);

    this.y.domain([0,45000]);

    var offsetL = document.getElementById("scatterVis").offsetLeft;
    var offsetT = document.getElementById("scatterVis").offsetTop;

    // updates axis
    this.svg.select(".y.axis")
        .call(this.yAxis)


    this.svg.select(".x.axis")
        .call(this.xAxis)
        //.attr("transform", "translate(5,230)")

    //Low-Low
    // on enter

    var dots = this.svg.selectAll(".circle")
        .data(that.displayData.country);


    dots.enter().append("g").append("circle")

    dots
        .attr("class","circle")


    dots.exit()
        .remove();

    // on update



    dots.select("circle")
        //.transition()
        .attr("cx", function(d,i){ return 5 + that.x(that.displayData.size_low[i])})
        .attr("cy", function(d,i){return that.y(that.displayData.wage_diff_low[i])})
        .style("fill", "black")
        .attr("r", 0);

    dots
        .on("click", function (d, i) { console.log([that.displayData.country[i]])
            $(that.eventHandler).trigger("scatter_selection", [that.displayData.country[i]])

        })
        .on("mousemove", function (d, i) {
            var mouse = d3.mouse(that.svg.node()).map(function (d) {
                return parseInt(d);
            });

            that.tooltip_nonoecd.classed("hidden", false)
                .attr("style", "left:" + (mouse[0] + offsetL +10) + "px;top:" + (mouse[1] + offsetT+ 10) + "px" )
                .html(that.displayData.country[i])

        })
        .on("mouseout", function (d, i) {

            that.tooltip_nonoecd.classed("hidden", true);
        });

    if(document.getElementById("low").checked){

    var dots = this.svg.selectAll(".circle")
        .data(that.displayData.country);


    dots.enter().append("g").append("circle")

    dots
        .attr("class","circle")


    dots.exit()
        .remove();

    // on update



    dots.select("circle")
        .attr("r", 1e-6)
        .transition().duration(1000)
        .attr("cx", function(d,i){ return 5 + that.x(that.displayData.size_low[i])})
        .attr("cy", function(d,i){return that.y(that.displayData.wage_diff_low[i])})
        .style("fill", "black")
        .attr("r", 3);

        dots
            .on("click", function (d, i) { console.log([that.displayData.country[i]])
                $(that.eventHandler).trigger("scatter_selection", [that.displayData.country[i]])

            })
            .on("mousemove", function (d, i) {
                var mouse = d3.mouse(that.svg.node()).map(function (d) {
                    return parseInt(d);
                });

                that.tooltip_nonoecd.classed("hidden", false)
                    .attr("style", "left:" + (mouse[0] + offsetL +10) + "px;top:" + (mouse[1] + offsetT+ 10) + "px" )
                    .html(that.displayData.country[i])

            })
            .on("mouseout", function (d, i) {

                that.tooltip_nonoecd.classed("hidden", true);
            });


    }

    //Med-Med
    // on enter
    if(document.getElementById("medium").checked) {
        var dots2 = this.svg.selectAll(".circle1")
            .data(that.displayData.country);


        dots2.enter().append("g").append("circle")

        dots2
            .attr("class", "circle")


        dots2.exit()
            .remove();

        // on update
        dots2.select("circle")
            .attr("r", 1e-6)
            .transition().duration(1000)
            .attr("cx", function (d, i) {
                return 5 + that.x(that.displayData.size_medium[i])
            })
            .attr("cy", function (d, i) {
                return that.y(that.displayData.wage_diff_medium[i])
            })
            .style("fill", "red")
            .attr("r", 3);

        dots2
            .on("click", function (d, i) { console.log([that.displayData.country[i]])
                $(that.eventHandler).trigger("scatter_selection", [that.displayData.country[i]])

            })
            .on("mousemove", function (d, i) {
                var mouse = d3.mouse(that.svg.node()).map(function (d) {
                    return parseInt(d);
                });

                that.tooltip_nonoecd.classed("hidden", false)
                    .attr("style", "left:" + (mouse[0] + offsetL +10) + "px;top:" + (mouse[1] + offsetT+ 10) + "px" )
                    .html(that.displayData.country[i])

            })
            .on("mouseout", function (d, i) {

                that.tooltip_nonoecd.classed("hidden", true);
            });

    }

    if(document.getElementById("high").checked) {
        //High-High
        // on enter
        var dots3 = this.svg.selectAll(".circle2")
            .data(that.displayData.country);


        dots3.enter().append("g").append("circle")

        dots3
            .attr("class", "circle")


        dots3.exit()
            .remove();

        // on update
        dots3.select("circle")
            .attr("r", 1e-6)
            .transition().duration(1000)
            .attr("cx", function (d, i) {
                return 5 + that.x(that.displayData.size_high[i])
            })
            .attr("cy", function (d, i) {
                return that.y(that.displayData.wage_diff_high[i])
            })
            .style("fill", "green")
            .attr("r", 3)

        dots3
            .on("click", function (d, i) { console.log([that.displayData.country[i]])
                $(that.eventHandler).trigger("scatter_selection", [that.displayData.country[i]])

            })
            .on("mousemove", function (d, i) {
                var mouse = d3.mouse(that.svg.node()).map(function (d) {
                    return parseInt(d);
                });

                that.tooltip_nonoecd.classed("hidden", false)
                    .attr("style", "left:" + (mouse[0] + offsetL +10) + "px;top:" + (mouse[1] + offsetT+ 10) + "px" )
                    .html(that.displayData.country[i])

            })
            .on("mouseout", function (d, i) {

                that.tooltip_nonoecd.classed("hidden", true);
            });

    }



    var unique = function(origArr) {
        var newArr = [],
            origLen = origArr.length,
            found, x, y;

        for (x = 0; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newArr.length; y++) {
                if (origArr[x] === newArr[y]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newArr.push(origArr[x]);
            }
        }
        return newArr;
    }


    this.brush.call(d3.svg.brush()
        .x(that.x)
        .y(that.y)
        .on("brush", function() {
            var extent = d3.event.target.extent();
            //console.log(extent);
            compare=[];
            for(z =0; z<20; z++) {
                if(extent[0][0] <= that.displayData.size_high[z] && that.displayData.size_high[z] < extent[1][0]
                        && extent[0][1] <= that.displayData.wage_diff_high[z]  && that.displayData.wage_diff_high[z] < extent[1][1]) {
                    compare.push(that.displayData.country[z])
                }
                if(extent[0][0] <= that.displayData.size_medium[z] && that.displayData.size_medium[z] < extent[1][0]
                    && extent[0][1] <= that.displayData.wage_diff_medium[z] && that.displayData.wage_diff_medium[z] < extent[1][1]) {
                    compare.push(that.displayData.country[z])
                }
                if(extent[0][0] <= that.displayData.size_low[z] && that.displayData.size_low[z] < extent[1][0]
                    && extent[0][1] <= that.displayData.wage_diff_low[z] && that.displayData.wage_diff_low[z] < extent[1][1]) {
                    compare.push(that.displayData.country[z]);
                }
                compareindex =[];
                compareindex = unique(compare);

            }
            console.log(compareindex);
            $(that.eventHandler).trigger( "scatter_selection",compareindex);
        }
    ));


    // add legend
    var legend = this.svg.selectAll(".legend")
        .data(that.displayData.country)


    legend
        .enter()
        .append("g")
        .each(function(d, i) {
            if (i<3) {
                var g = d3.select(this);
                g.append("circle")
                    .attr("cx", 680)
                    .attr("cy", (i + 2) * 12)
                    .attr("r", 5)
                    .style("fill", that.color_hash[String(i)][1]);

                g.append("text")
                    .attr("x", 700)
                    .attr("y", (i + 2) * 12 + 8)
                    .attr("height", 2)
                    .attr("width", 2)
                    // .style("fill", that.color_hash[String(i)][1])
                    .text(that.color_hash[String(i)][0]);
            }
        });

}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
ScatterVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    //var filter = {"start": selectionStart, "end": selectionEnd}


    //this.wrangleData(filter)

    this.updateVis();

}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
ScatterVis.prototype.filterAndAggregate = function(_filter){



    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }


    var that = this;


    // create an array of wage differential for different education levels
    var avg_wage_diffI = []
    var avg_wage_diffII = []
    var avg_wage_diffIII = []

    //create total number of migrants for each skill level
    var sizeI = []
    var sizeII = []
    var sizeIII = []

    var country=[]

    for (i = 0; i < 195; i++) {
        var lowskill=0
        var medskill=0
        var highskill=0

        var lowwage=0
        var medwage=0
        var highwage=0
        name=""

        for(z =0; z<20; z++) {
            if (that.data._children[z]._children[i].wage_diffI !=0) {
                if (that.data._children[z]._children[i]._children[3].size != 0) {
                    lowskill = lowskill + +that.data._children[z]._children[i]._children[0].size
                    medskill = medskill + +that.data._children[z]._children[i]._children[1].size
                    highskill = highskill + +that.data._children[z]._children[i]._children[2].size

                    lowwage = lowwage + +that.data._children[z]._children[i].wage_diffI
                    medwage = medwage + +that.data._children[z]._children[i].wage_diffII
                    highwage = highwage + +that.data._children[z]._children[i].wage_diffIII

                    name = that.data._children[z]._children[i].name

                }
            }

        }
        sizeI.push(parseInt(lowskill))
        sizeII.push(parseInt(medskill))
        sizeIII.push(parseInt(highskill))

        avg_wage_diffI.push(parseInt(lowwage)/8)
        avg_wage_diffII.push(parseInt(medwage)/8)
        avg_wage_diffIII.push(parseInt(highwage)/8)

        country.push(name)
    }

    var sizeI = sizeI.filter(function(v) {
        return v !== 0;
    });
    var sizeII = sizeII.filter(function(v) {
        return v !== 0;
    });
    var sizeIII = sizeIII.filter(function(v) {
        return v !== 0;
    });
    var avg_wage_diffI = avg_wage_diffI.filter(function(v) {
        return v !== 0;
    });
    var avg_wage_diffII = avg_wage_diffII.filter(function(v) {
        return v !== 0;
    });
    var avg_wage_diffIII = avg_wage_diffIII.filter(function(v) {
        return v !== 0;
    });
    var country = country.filter(function(v) {
        return v !== "";
    });

    sc = {"country":country,
        "size_low":sizeI,
        "size_medium": sizeII,
        "size_high":sizeIII,
        "wage_diff_low": avg_wage_diffI,
        "wage_diff_medium":avg_wage_diffII,
        "wage_diff_high":avg_wage_diffIII}


    return sc;
    //this.updateVis(sc);


    //that.data._children.map(function (d) {
    //    var lowskill=0
    //    var medskill=0
    //    var highskill=0
    //
    //    var lowwage=0
    //    var medwage=0
    //    var highwage=0
    //
    //
    //
    //
    //    for (i = 0; i < 195; i++) {
    //        if (d._children[i].wage_diffI !=0)
    //        {
    //            lowskill= lowskill + +d._children[i]._children[0].size
    //            medskill= medskill + +d._children[i]._children[1].size
    //            highskill= highskill + +d._children[i]._children[2].size
    //
    //            lowwage= lowwage + +d._children[i].wage_diffI
    //            medwage= medwage + +d._children[i].wage_diffII
    //            highwage= highwage + +d._children[i].wage_diffIII
    //
    //
    //
    //        }
    //    }
    //
    //    sizeI.push(parseInt(lowskill))
    //    sizeII.push(parseInt(medskill))
    //    sizeIII.push(parseInt(highskill))
    //
    //    avg_wage_diffI.push(parseInt(lowwage))
    //    avg_wage_diffII.push(parseInt(medwage))
    //    avg_wage_diffIII.push(parseInt(highwage))
    //
    //
    //
    //
    //
    //});



}

//function brushmove(p) {
//    var e = this.brush.extent();
//    countryname = that.svg.selectAll("circle").classed("hidden", function(d) {
//        return e[0][0] > d[p.x] || d[p.x] > e[1][0]
//            || e[0][1] > d[p.y] || d[p.y] > e[1][1];
//    });
//    console.log(countryname);
//}