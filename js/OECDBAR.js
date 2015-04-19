

OECDBAR = function(_parentelement, _alldata, eventhandler){
    this.parentElement = _parentelement;
    this.data = _alldata;
    this.displayData =[]

    this.eventhandler = eventhandler;

    this.width = getInnerWidth(this.parentElement);
    this.height = 500;



    this.initvis();

};


OECDBAR.prototype.initvis = function(){

    var that = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height+200)
        .append("g")
        .attr("class", 'graph')



    this.x = d3.scale.linear()
        .range([0,this.width - 30])

    this.y = d3.scale.linear()
        .range([0,this.height]);

    this.color = d3.scale.category20();


    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom")


    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left")

    this.svg.append("g")
        .attr("class", "y_axis")
        .attr("transform", "translate(50,20)");

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(50,"+ (this.height + 20) + ")")

    this.wrangledata("Brazil");
    this.updatevis();

};

OECDBAR.prototype.wrangledata = function(name){


    this.displayData = this.filter(name);
};

OECDBAR.prototype.updatevis = function(){

    var that = this;

    //What is selected?
    this.x.domain([0, d3.max(that.displayData)]);
    this.y.domain([0,20]); //Can change if we just do wages


    this.svg.select(".x.axis")
        .call(that.xAxis)


    this.svg.select(".y.axis")
        .call(that.yAxis)

    //Need to put innerHTML to input Title that will change depending on what has been selected


    var rect = this.svg.selectAll(".rect")
        .data(that.displayData, function(d){return d})

    rect.enter().append("g").append("rect")



    rect
        .attr("class", "rect")
        .attr("fill", function(d,i){return that.color(i)})
        .attr("opacity",1)
    //.transition()
    //.attr("transform", function(d,i) {return "translate("+that.x(i)+",0)"})
    //.attr("x", function(d,i){return (that.x(i) + that.margin.left + that.margin.right)})


    rect
        .exit()
        .remove();

    rect.select("rect")
        .transition()
        .attr("width", function(d,i) { return that.x(d)})
        .attr("height", 20)
        .attr("x", 50)
        .attr("y", function(d,i) {return that.y(i) +20 ; })

    //--------------Text----------------

    var oecd_abbr = ["AUS", "AUT", "CAN", "CHE", "CHL", "DEU", "DNK", "ESP", "FIN", "FRA", "GBR",
                     "GRC", "IRL", "LUX", "NDL", "NOR", "NZL", "PRT", "SWE", "USA"];

    var text = this.svg.selectAll(".text_oecd")
        .data(oecd_abbr, function(d){return d})

    text.enter().append("g").append("text")



    text.select("text")
        .transition().duration(500)
        .text(function(d,i) {return d })
        .attr("font-size", "11px")
        .attr("x", 20)
        .attr("y", function(d,i) { return that.y(i) + 33; });

    text
        .exit()
        .remove();





};

OECDBAR.prototype.selection= function (name){


    this.wrangledata(filter)

    this.updatevis();


}

//----------------------------------
//Helper Functions
//----------------------------------

OECDBAR.prototype.filter = function(name){

    var total_oecd = []


    that.data._children.map(function(d){
        for (i = 0; i < 195; i++) {
            if(d._children[i].name == name) {total_oecd.push(d._children[i].size)} //Migrant for each NON OECD per OECD
        }

    })

    return total_oecd;



}

var getInnerWidth = function(element) {
    var style = window.getComputedStyle(element.node(), null);

    return parseInt(style.getPropertyValue('width'));
}

