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
    this.height = (this.width) / 2.1

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

    this.z = d3.scale.ordinal().range(["orange", "blue", "green"])

    this.yalt = d3.scale.linear()
        .range([this.height-68,20]);


    this.color_hash = {  0 : ["Wage Differential", "Blue"],
        1 : ["Aid", "Orange"],
        2 : ["Remittance", "Red"]
    }

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .ticks(21)
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
        //.style("font-size", "8px")
        //.style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})

    this.svg.append("g")
        .attr("class", "x axis")
        //.attr("transform", "translate(0,20)")
        //.style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})


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

    //console.log(that.displayData);


    // updates scales

    this.x.domain([0,21])
    this.y.domain([0,300000000000])
    this.yalt.domain([0,300000000000])
    console.log(that.displayData.country)

    // updates axis
    this.svg.select(".y.axis")
        .call(this.yAxis)


    this.svg.select(".x.axis")
        .call(this.xAxis)

    this.svg.select(".x.axis")
        .attr("transform", "translate(5,"+ (that.height - 68) +")")
        .call(that.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "9px")
        .attr("dx", ".1em")
        .attr("dy", ".40em")
        .attr("transform", function(d) {
            return "rotate(-60)"
        });


    //// Add a group for each column.
    //var valgroup = this.svg.selectAll("g.valgroup")
    //    .data(that.displayData)
    //    .enter().append("svg:g")
    //    .attr("class", "valgroup")
    //    .style("fill", function(d, i) { return that.z(i); })
    //    .style("stroke", function(d, i) { return d3.rgb(that.z(i)).darker(); });
    //
    //// Add a rect for each date.
    //var rect = valgroup.selectAll("rect")
    //    .data(function(d){return that.displayData})
    //    .enter().append("svg:rect")
    //    .attr("x", function(d,i) { return  5 + that.x(i); })
    //    .attr("y", function(d, i,j) { return - that.y(that.displayData[i][j].y0) - that.y(that.displayData[i][j].y); })
    //    .attr("height", function(d,i,j) { return that.y(that.displayData[i][j].y); })
    //    .attr("width", 10);

    //Differential
    var bar = this.svg.selectAll(".rect")
        .data(that.displayData.country);

    bar.enter().append("g").append("rect");

    // Add attributes (position) to all bars
    bar
        .attr("class", "rect")
        .attr("fill", "blue")

    bar.exit()
        .remove();

    bar.select("rect")
        .attr("x", function(d,i){ return 5 + that.x(i)})
        .attr("y", function(d,i){ return  that.height - 48 -  that.y(that.displayData.total_differential[i])})
        .attr("width", 6)
        .attr("height", function(d, i) {
            return that.y(that.displayData.total_differential[i]) - 20 ;
        });

    //Aid
    var bar2 = this.svg.selectAll(".rect2")
        .data(that.displayData.country);

    bar2.enter().append("g").append("rect");

    // Add attributes (position) to all bars
    bar2
        .attr("class", "rect")
        .attr("fill", "orange")

    bar2.exit()
        .remove();

    bar2.select("rect")
        .attr("x", function(d,i){ return 11 + that.x(i)})
        .attr("y", function(d,i){ return  that.height - 48 -  that.y(that.displayData.total_aid[i])})
        .attr("width", 6)
        .attr("height", function(d, i) {
            return that.y(that.displayData.total_aid[i]) - 20 ;
        });

    //Aid
    var bar3 = this.svg.selectAll(".rect3")
        .data(that.displayData.country);

    bar3.enter().append("g").append("rect");

    // Add attributes (position) to all bars
    bar3
        .attr("class", "rect")
        .attr("fill", "red")

    bar3.exit()
        .remove();

    bar3.select("rect")
        .attr("x", function(d,i){ return 17 + that.x(i)})
        .attr("y", function(d,i){ return  that.height - 48 -  that.y(that.displayData.total_remit[i])})
        .attr("width", 6)
        .attr("height", function(d, i) {
            return that.y(that.displayData.total_remit[i]) - 20 ;
        });

    // add legend
    var legend = this.svg.selectAll(".legend")
        .data(that.displayData.country)



    legend
        .enter()
        .append("g")
        .each(function(d, i) {
            if (i<3) {
                var g = d3.select(this);
                g.append("rect")
                    .attr("x", 475)
                    .attr("y", (i + 2) * 12)
                    .attr("width", 10)
                    .attr("height", 5)
                    .style("fill", that.color_hash[String(i)][1]);

                g.append("text")
                    .attr("x", 495)
                    .attr("y", (i + 2) * 12 + 8)
                    .attr("height", 3)
                    .attr("width", 3)
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

    var totaid = []

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
        var totalaid=0
        var totalrem = 0
        name=""

        for(z =0; z<20; z++) {
            if (that.data._children[z]._children[i].wage_diffI !=0) {

                if (that.data._children[z]._children[i]._children[3].size != 0) {
                    lowskill = lowskill + +that.data._children[z]._children[i]._children[0].size
                    medskill = medskill + +that.data._children[z]._children[i]._children[1].size
                    highskill = highskill + +that.data._children[z]._children[i]._children[2].size

                    totalskill = lowskill + medskill + highskill

                    lowwage = lowwage + +that.data._children[z]._children[i].wage_diffI
                    medwage = medwage + +that.data._children[z]._children[i].wage_diffII
                    highwage = highwage + +that.data._children[z]._children[i].wage_diffIII

                    totalwage = lowwage + medwage + highwage

                    totalwagediff = totalskill * totalwage

                    totalaid = totalaid + +that.data._children[z]._children[i]._children[3].size

                    totalrem = totalrem + +that.data._children[z]._children[i]._children[4].size

                    name = that.data._children[z]._children[i].name

                }
            }
        }
        sizeI.push(parseInt(lowskill))
        sizeII.push(parseInt(medskill))
        sizeIII.push(parseInt(highskill))

        avg_wage_diffI.push(parseInt(lowwage)/20)
        avg_wage_diffII.push(parseInt(medwage)/20)
        avg_wage_diffIII.push(parseInt(highwage)/20)

        totaldifferential.push(parseInt(totalwagediff))
        totaid.push(parseInt(totalaid) * 100)
        totalremittance.push(parseInt(totalrem) * 1000000)

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
    var totaid = totaid.filter(function(v) {
            return v !== 0
    });
    var totalremittance = totalremittance.filter(function(v) {
            return v !== 0;
    });
    var totaldifferential = totaldifferential.filter(function(v) {
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
        "total_aid": totaid,
        "total_remit":  totalremittance,
        "total_differential": totaldifferential}

    return sc;

    //var sc=[];
    //
    //for (x =0; x<21; x++){
    //    sc[x] =
    //    {
    //        "index":x,
    //    "country": country[x],
    //    "size_low": sizeI[x],
    //    "size_medium": sizeII[x],
    //        "size_high": sizeIII[x],
    //    "wage_diff_low":  avg_wage_diffI[x],
    //    "wage_diff_medium": avg_wage_diffII[x],
    //    "wage_diff_high": avg_wage_diffIII[x],
    //    "total_aid": totaid[x],
    //    "total_remit":  totalremittance[x],
    //    "total_differential": totaldifferential[x],
    //}};
    //
    ////st = [totaldifferential,totaid,totalremittance]
    ////console.log(st);
    //
    //
    //map1=[];
    //map2=[];
    //
    //
    //for(a=0; a<21; a++) {
    //    map1[a] = [sc[a].total_aid,sc[a].total_remit,sc[a].total_differential]
    //    map2[a] = [sc[a].index,sc[a].total_aid,sc[a].total_remit,sc[a].total_differential]
    //}
    //
    //
    //console.log(map2);
    //
    //    var remapped = map1.map(function (dat, i) {
    //        return map2.map(function (d, ii) {
    //            return {x: ii, y: d[i + 1]};
    //        })
    //    });
    //
    ////console.log(remapped);
    //
    //var stacked = d3.layout.stack()(remapped)
    ////console.log(stacked);
    //
    //return stacked;
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