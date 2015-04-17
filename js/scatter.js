/**
 * Created by samikadhikari on 4/16/15.
 */


//This file creates the scatter plot with avg wage differential on the y axis and total stock of migrants in the x axis


ScatterVis = function(_parentElement, _alldata, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _alldata;
    this.displayData = [];
    this.eventHandler = _eventHandler;
    console.log(this.data);

    this.width = getInnerWidth(this.parentElement)
    this.height = (this.width) / 2.4

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

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(60,0)");

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height/1.1 + ")");

    this.svg.append("text")
        .attr("x", (that.width / 2))
        .attr("y", 0 + (that.height/20))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Scatter Plot of Average Wage Differentials and Migrant Stock");


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
    this.x.domain([0,100000]);
    this.y.domain([0,100000]);

    // updates axis
    this.svg.select(".y.axis")
        .call(this.yAxis);

    this.svg.select(".x.axis")
        .call(this.xAxis)

    // on enter
    var circles = this.svg.selectAll(".dot")
        .data(this.displayData);

    circles.enter()
        .append("circle")
        .attr("class", "dot");

    circles.exit().remove();

    // on update
    circles.attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .style("fill", "steelblue")
        .attr("r", 6);



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
//
//
//    // Set filter to a function that accepts all items
//    // ONLY if the parameter _filter is NOT null use this parameter
//    var filter = function(){return true;}
//    if (_filter != null){
//        filter = _filter;
//    }
//    //Dear JS hipster, a more hip variant of this construct would be:
//    // var filter = _filter || function(){return true;}
//
//    var that = this;
//
//
//    // create an array of values for age 0-100
//    var avg_wage_diff = d3.range(24).map(function () {
//        return 0;
//    });
//    // accumulate all values that fulfill the filter criterion
//
//    // TODO: implement the function that filters the data and sums the values
//
//
//    that.data.map(function (d,i) {
//        if (d["_children"][i]["_children"][i]["wage_diffI"] !=0) {}
//        else {
//            for (i = 0; i < d["_children"].length; i++) {
//                avg_wage_diff[i] = avg_wage_diff[i] + d["_children"][i]["_children"][i]["wage_diffI"][i];
//            }
//        }
//        }
//        return avg_wage_diff
//    });

}