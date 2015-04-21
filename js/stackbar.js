/**
 * Created by samikadhikari on 4/20/15.
 */

//This file creates the scatter plot with avg wage differential on the y axis and total stock of migrants in the x axis


StackbarVis = function(_parentElement, _alldata, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _alldata;
    this.displayData = [];
    this.eventHandler = _eventHandler;


    this.width = getInnerWidth(this.parentElement)
    this.height = (this.width) / 2.2

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
StackbarVis.prototype.initVis = function(){

    var that = this; // read about the this

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("class", "graph")

    this.x = d3.scale.linear()
        .range([54, this.width-30]);

    this.y = d3.scale.linear()
        .range([20,this.height-68]);

    this.yalt = d3.scale.linear()
        .range([this.height-68,20]);


    this.color = d3.scale.category10();

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .ticks(25)
        .tickFormat(function(d){return that.displayData.country[d]})
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.yalt)
        .orient("left")
        //.ticks(5)
        .tickFormat(d3.format(".2s"))


    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(54,0)")
        .style("font-size", "8px")
        .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,20)")
        .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})


    this.svg.append("text")
        .attr("x", (that.width / 2))
        .attr("y", 0 + (that.height/20))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Average wage differentials in comparison to Remittances/Aid");


    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
StackbarVis.prototype.wrangleData= function(_filterFunction){

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
StackbarVis.prototype.updateVis = function(){

    var that = this;


    // updates scales

    this.x.domain([0,25]);
    this.yalt.domain([0,2000000000000]);
    console.log(that.displayData.total_wage_differential);
    this.y.domain([0,2000000000000]);

    // updates axis
    this.svg.select(".y.axis")
        .call(this.yAxis)


    this.svg.select(".x.axis")
        .call(this.xAxis)

    this.svg.select(".x.axis")
        .attr("transform", "translate(5,205)")
        .call(that.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "9px")
        .attr("dx", ".1em")
        .attr("dy", ".40em")
        .attr("transform", function(d) {
            return "rotate(-60)"
        });


    //Bar
    var bar = this.svg.selectAll(".rect")
        .data(that.displayData.country);

    bar.enter().append("g").append("rect");

    // Add attributes (position) to all bars
    bar
        .attr("class", "rect")
        .attr("fill", "orange")

    bar.exit()
        .remove();

    bar.select("rect")
        .attr("x", function(d,i){ return 5 + that.x(i)})
        .attr("y", function(d,i){ return  that.height - 48 - that.y(that.displayData.total_wage_differential[i])})
        .attr("width", 10)
        .attr("height", function(d, i) {
            return that.y(that.displayData.total_wage_differential[i]) - 20 ;
        });


}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
StackbarVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

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
StackbarVis.prototype.filterAndAggregate = function(_filter){



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

    var totaldifferential = []

    var totalremittance = []

    var country=[]

    for (i = 0; i < 195; i++) {
        var lowskill=0
        var medskill=0
        var highskill=0
        var totalskill=0

        var lowwage=0
        var medwage=0
        var highwage=0
        var totalwage=0

        var totalwagediff=0
        var totalrem = 0
        name=""

        for(z =0; z<20; z++) {
            if (that.data._children[z]._children[i].wage_diffI !=0)
            {
                lowskill= lowskill + +that.data._children[z]._children[i]._children[0].size
                medskill= medskill + +that.data._children[z]._children[i]._children[1].size
                highskill= highskill + +that.data._children[z]._children[i]._children[2].size

                totalskill = lowskill + medskill + highskill

                lowwage= lowwage + +that.data._children[z]._children[i].wage_diffI
                medwage= medwage + +that.data._children[z]._children[i].wage_diffII
                highwage= highwage + +that.data._children[z]._children[i].wage_diffIII

                totalwage = lowwage + medwage + highwage

                totalwagediff = totalskill * totalwage

                totalrem= totalrem + +that.data._children[z]._children[i]._children[4].size

                name = that.data._children[z]._children[i].name

            }

        }
        sizeI.push(parseInt(lowskill))
        sizeII.push(parseInt(medskill))
        sizeIII.push(parseInt(highskill))

        avg_wage_diffI.push(parseInt(lowwage)/20)
        avg_wage_diffII.push(parseInt(medwage)/20)
        avg_wage_diffIII.push(parseInt(highwage)/20)

        totaldifferential.push(parseInt(totalwagediff))
        totalremittance.push(parseInt(totalrem))

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
    var totaldifferential = totaldifferential.filter(function(v) {
        return v !== 0;
    });
    var totalremittance = totalremittance.filter(function(v) {
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
        "wage_diff_high":avg_wage_diffIII,
        "total_remit": totalremittance,
        "total_wage_differential":totaldifferential
    }

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