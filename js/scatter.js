/**
 * Created by samikadhikari on 4/16/15.
 */


//This file creates the scatter plot with avg wage differential on the y axis and total stock of migrants in the x axis


ScatterVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];


    this.margin = {top: 20, right: 20, bottom: 10, left: 60},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
ScatterVis.prototype.initVis = function(){

    var that = this; // read about the this


    //TODO: construct or select SVG
    //TODO: create axis and scales


    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("class", 'graph')
        .attr("transform", "translate("+this.margin.left+","+this.margin.top+")")

    // creates axis and scales
    this.y = d3.scale.linear()
        .range([0,this.height-160]);

    this.yalt = d3.scale.linear()
        .range([this.height-160,0]);


    this.x = d3.scale.linear()
        .range([0,this.width-180])

    this.color = d3.scale.category20();

    this.yAxis = d3.svg.axis()
        .scale(this.yalt)
        .orient("left");

    this.xAxis = d3.svg.axis()
        .scale(this.x)

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 30 + "," +0+ ")")

    this.svg.append("g")
        .attr("class", "x axis")


    this.svg.append("text")
        .attr("x", (this.width / 2))
        .attr("y", 0 - (this.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Average Wage differential and migrant stocks");





    // Add axes visual elements
    //this.svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + this.height + ")")

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
    this.y.domain([0,d3.max(that.displayData, function(d) { return d; })]);
    this.x.domain([0,16]);

    // updates axis
    this.svg.select(".y.axis")
        .attr("transform", "translate(" + 20 + " ,0)")
        .call(this.yAxis);

    this.svg.select(".x.axis")
        .attr("transform", "translate(0,215)")
        .call(that.xAxis)

    // updates graph

    // Data join

    var dots = this.svg.selectAll("circle")
        .data(this.displayData, function(d){return d});

    // Append new circle groups, if required
    var circle_enter = dots.enter().append("g").append("circle")


    // Add click interactivity

    circle_enter.on("click", function(d) {
        $(that.eventHandler).trigger("selectionChanged", that.brush.extent());
    })

    // Add attributes (position) to all dots

    dots
        .attr("class","circle")
        .attr("r", 6)
        .attr("fill", "steelblue")



    // Remove the extra circles

    dots.exit()
        .remove();

    // Update all inner circles and texts (both update and enter sets)


    dots.select("circle")
        .transition()
        .attr("cx", function(d,i) {return that.x(i)+50 })
        .attr("cy", function(d, i) {
            return 160-that.y(d);
        })
        .attr("r", 6)
        .attr("fill", "steelblue")



}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
ScatterVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function


    var filter = {"start": selectionStart, "end": selectionEnd}


    this.wrangleData(filter)

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


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var that = this;


    // create an array of values for age 0-100
    var res = d3.range(16).map(function () {
        return 0;
    });
    // accumulate all values that fulfill the filter criterion

    // TODO: implement the function that filters the data and sums the values


    that.data.map(function (d) {

        }

    });




}