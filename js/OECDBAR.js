
var total_popI = 0;
var total_popII = 0;
var total_popIII = 0;
var aid = 0;
var rem = 0;
var pop = 0;


OECDBAR = function(_parentelement, _alldata, eventhandler){
    this.parentElement = _parentelement;
    this.data = _alldata;
    this.displayData= {"name":[], "total": [], "type":[], "tool": []};
    this.olddisplayData = {"name":[], "total": [], "type":[], "tool": []};

    this.eventhandler = eventhandler;

    this.width = getInnerWidth(this.parentElement);
    this.height = 430;
    this.selected_country = ["Argentina"];

    this.units =0;
    this.formatNumber = d3.format(",.0f");  // zero decimal places


    //To show country names when hovering over the country
    this.tooltip_oecd = d3.select("body").append("div").attr("class", "tooltip hidden");

    this.initvis();

};


OECDBAR.prototype.initvis = function(){

    var that = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height+150)
        .append("g")
        .attr("class", 'graph')


    this.x = d3.scale.linear()
        .range([0,this.width - 75])

    this.xalt = d3.scale.linear()
        .range([this.width-68,30]);


    this.y = d3.scale.linear()
        .range([0,this.height]);

    this.color = d3.scale.category20();


    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom")
        .tickFormat(d3.format(".2s"))



    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left")

    this.svg.append("g")
        .attr("class", "y_axis")
        .attr("transform", "translate(50,20)");

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(50,"+ (this.height + 20) + ")")



    this.wrangledata(["Argentina"]);
    this.addSlider(this.svg)


};

OECDBAR.prototype.wrangledata = function(name){


    this.selected_country = name;
    this.displayData = this.filter(name);


    this.updatevis()


};

OECDBAR.prototype.updatevis = function(){

    var that = this;

    //What is selected?


    this.y.domain([0,that.displayData.total.length])

    this.x.domain([0, d3.max(that.displayData.total)])


    var offsetL = document.getElementById("graph_1").offsetLeft;
    var offsetT = document.getElementById("graph_1").offsetTop;

    this.svg.select(".x.axis")
        .call(that.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"})



    this.svg.select(".y.axis")
        .call(that.yAxis)



    var rect = this.svg.selectAll(".rect")
        .data(that.displayData.total, function(d){return d})

    rect.enter().append("rect").attr("class", "rect")


    rect
        .attr("x", 50)
        .attr("y", function(d,i) {return that.y(i) +12 ; })
        .attr("height", 15)
        .attr("width", function(d,i) { return that.x(d)})




    rect
        .attr("fill", function(d,i){
            if(that.displayData.type[i] == "W" || that.displayData.type[i] == "I"  ){return that.color(4)}
            else if(that.displayData.type[i] == "A" || that.displayData.type[i] == "II"  ){return that.color(8)}
            else{ return that.color(1)}})
        .attr("opacity",1)
        .on("click", function (d, i) {
            $(that.eventHandler).trigger("oecd_selection", [that.displayData.name[i]])

        })
        .on("mousemove", function (d, i) {
            var mouse = d3.mouse(that.svg.node()).map(function (d) {
                return parseInt(d);
            });
            if(document.getElementById("per_capita").checked ){that.units = "per Migrant"}else{that.units = ""}
            if(document.getElementById("per_capita").checked && that.displayData.type[i] == "R" ){that.units = "per Migrant"}
            if(document.getElementById("per_capita").checked && that.displayData.type[i] == "W" ){that.units = "per Migrant"}
            if(document.getElementById("per_capita").checked && that.displayData.type[i] == "A"){that.units = "per capita"};
            that.tooltip_oecd.classed("hidden", false)
                .attr("style", "left:" + (mouse[0] + offsetL +10) + "px;top:" + (mouse[1] + offsetT+ 80) + "px" )
                .html(that.displayData.tool[i] +" $" +that.formatNumber(d) + " " + that.units);

        })
        .on("mouseout", function (d, i) {

            that.tooltip_oecd.classed("hidden", true);
        });

    rect
        .exit()
        .remove();

    //--------------Text----------------

    var oecd_abbr = ["AUS", "AUT", "CAN", "CHE", "CHL", "DEU", "DNK", "ESP", "FIN", "FRA", "GBR",
                     "GRC", "IRL", "LUX", "NDL", "NOR", "NZL", "PRT", "SWE", "USA"];

    var oecd_full = ["Australia", "Austria", "Canada", "Switzerland", "Chile", "Germany", "Denmark", "Spain", "Finland", "France", "Great Britain",
        "Greece", "Ireland", "Luxembourg", "Netherlands", "Norway", "New Zealand", "Portugal", "Sweden", "United States" ]

    var counter = 0;
    var yaxis_names = this.displayData.name.map(function(d,z){
        for(i=0; i<oecd_full.length; i++) {
            if (d == oecd_full[i]){return oecd_abbr[i]}

        }
    });



    var text = this.svg.selectAll(".text_oecd")
        .data(yaxis_names, function(d){return d})

    text.enter().append("g").append("text")



    text.select("text")
        .transition().duration(500)
        .text(function(d,i) {return d })
        .attr("font-size", "13px")
        .attr("x", 5)
        .attr("y", function(d,i) { return that.y(i) + 47; });

    text
        .exit()
        .remove();

    var text2 = this.svg.selectAll(".text_mid")
        .data(that.displayData.total, function(d) {return d})

    text2.enter().append("g").append("text").attr("class", "text_mid")




    text2.select("text")
        .transition().duration(500)
        .text(function(d,i) {return that.displayData.type[i] })
        .attr("font-size", "13px")
        .attr("x", 35)
        .attr("y", function(d,i) { return that.y(i) + 25; });

    text2
        .exit()
        .remove();
    console.log("test")



    if(document.getElementById("migrant_stock").checked) {

        var sum = 0;
        for (i = 0; i < that.displayData.total.length; i++) {
            sum = sum + that.displayData.total[i]
        }


        //clear current list
        document.getElementById('totalW').innerHTML = ("$" + String(that.formatNumber(sum)));
        document.getElementById('totalA').innerHTML = ("$" + String(that.formatNumber(aid)));
        document.getElementById('totalR').innerHTML = ("$" + String(that.formatNumber(rem)));

    } else {
        var sum = 0;
        for (i = 0; i < that.displayData.total.length; i++) {
            sum = sum + that.displayData.total[i]
        }

        var average = sum / 24;

        //clear current list
        document.getElementById('totalW').innerHTML = ("$" + String(that.formatNumber(average)) + " per migrant");
        document.getElementById('totalA').innerHTML = ("$" + String(that.formatNumber(aid/(total_popI+total_popII+total_popIII))) + " per migrant");
        document.getElementById('totalR').innerHTML = ("$" + String(that.formatNumber(rem/(total_popI+total_popII+total_popIII))) + " per migrant");



    }





};

OECDBAR.prototype.selection= function (name){


    this.wrangledata(name)

    this.updatevis();


}

//----------------------------------
//Helper Functions
//----------------------------------

OECDBAR.prototype.filter = function(name){


    this.olddisplayData = this.displayData || 1;
    selected_name = name || ["Argentina"]



    var total_oecd = {"name":[], "total": [], "type":[]};

    if(document.getElementById("Wage").checked){
        total_oecd = {"name":[], "total": [], "type":[], "tool": []};
        var counter = 0;


        that.data._children.map(function (d) {

            if (d.wageI > 0) {
                for(i=0; i<3; i++) {
                    total_oecd.name[counter] = d.name;
                    counter++;
                }
            }
        });


        this.data._children.map(function(d){
            var check =1;
            for (i = 0; i <total_oecd.name.length-2; i=i+3) {

                var total_wageI = 0;
                var total_wageII = 0;
                var total_wageIII = 0;
                total_popI = 0;
                total_popII = 0;
                total_popIII = 0;
                aid = 0;
                rem = 0;
                pop = 0;
                if (check == 1) {

                    if (d.name == total_oecd.name[i]) {
                        check = 0;

                        for (z = 0; z < 195; z++) {
                            selected_name.map(function (selection) {


                                if (selection == d._children[z].name) {
                                    total_wageI = total_wageI + (d._children[z]._children[0].size * (d.wageI - d._children[z]._children[0].wage))
                                    total_wageII = total_wageII + (d._children[z]._children[1].size * (d.wageII - d._children[z]._children[1].wage))
                                    total_wageIII = total_wageIII + (d._children[z]._children[2].size * (d.wageIII - d._children[z]._children[2].wage));

                                    aid = aid + d._children[z]._children[3].size;
                                    rem = rem + (d._children[z]._children[4].size*1000000);

                                    total_popI = total_popI + d._children[z]._children[0].size;
                                    total_popII = total_popII + d._children[z]._children[1].size;
                                    total_popIII = total_popIII + d._children[z]._children[2].size;

                                    pop = pop + d._children[z].size



                                }

                            })
                        }
                        console.log("test");


                        total_oecd.type[i] = "I"
                        total_oecd.type[i + 1] = "II"
                        total_oecd.type[i + 2] = "III"

                        total_oecd.tool[i] = "Ed Level I: "
                        total_oecd.tool[i + 1] = "Ed Level II: "
                        total_oecd.tool[i + 2] = "Ed Level III: "

                        if (document.getElementById("migrant_stock").checked) {
                            if(total_wageI > 0){
                                total_oecd.total[i] = Math.round(total_wageI)
                            } else  {total_oecd.total[i]=0};
                            if(total_wageII > 0){
                                total_oecd.total[i + 1] = Math.round(total_wageII)
                            } else {total_oecd.total[i + 1]=0}
                            if(total_wageIII > 0){
                                total_oecd.total[i + 2] = Math.round(total_wageIII)
                            } else {total_oecd.total[i + 2]=0}

                            if (document.getElementById("compare").checked) {

                                if(total_wageI < 0 ){ total_wageI = 0}
                                if(total_wageII < 0){total_wageII = 0}
                                if(total_wageIII < 0){total_wageIII = 0}

                                total_oecd.total[i] = Math.round(total_wageI + total_wageII + total_wageIII);

                                total_oecd.total[i+1] = Math.round(aid)
                                total_oecd.total[i+2] = Math.round(rem)

                                total_oecd.type[i] = "W"
                                total_oecd.type[i + 1] = "A"
                                total_oecd.type[i + 2] = "R"

                                total_oecd.tool[i] = "Wage: "
                                total_oecd.tool[i + 1] = "Aid: "
                                total_oecd.tool[i + 2] = "Remittance: "
                            }

                        } else {
                            if (total_wageI > 0) {
                                total_oecd.total[i] = Math.round(total_wageI / total_popI)
                            } else {
                                total_oecd.total[i] = 0
                            }
                            if (total_wageII > 0) {
                                total_oecd.total[i + 1] = Math.round(total_wageII / total_popII)
                            } else {
                                total_oecd.total[i + 1] = 0
                            }
                            if (total_wageIII > 0) {
                                total_oecd.total[i + 2] = Math.round(total_wageIII / total_popIII)
                            } else {
                                total_oecd.total[i + 2] = 0
                            }

                            if (document.getElementById("compare").checked) {
                                if(total_wageI < 0 ){ total_wageI = 0}
                                if(total_wageII < 0){total_wageII = 0}
                                if(total_wageIII < 0){total_wageIII = 0}


                                if(pop==0){total_oecd.total[i+1]=0}else{total_oecd.total[i+1] = Math.round(aid / pop)};
                                if(total_popI == 0 && total_popII ==0 && total_popIII ==0){
                                    total_oecd.total[i] = 0;
                                    total_oecd.total[i+2]=0}
                                else{
                                    total_oecd.total[i] = Math.round((total_wageI + total_wageII + total_wageIII)/ (total_popI + total_popII + total_popIII))
                                    total_oecd.total[i+2] = Math.round(rem / (total_popI + total_popII + total_popIII))}

                                total_oecd.type[i] = "W"
                                total_oecd.type[i + 1] = "A"
                                total_oecd.type[i + 2] = "R"

                                total_oecd.tool[i] = "Wage: "
                                total_oecd.tool[i + 1] = "Aid: "
                                total_oecd.tool[i + 2] = "Remittance: "
                            }
                        }





                    }
                }
            }

        })
    }




    return total_oecd;



}

var getInnerWidth = function(element) {
    var style = window.getComputedStyle(element.node(), null);

    return parseInt(style.getPropertyValue('width'));
}

OECDBAR.prototype.addSlider = function(svg){
    var that = this;


    var sliderDragged = function(){

        var sliderScale = d3.scale.linear()
            .domain([0,d3.max(that.displayData.total)])
            .range([200,0])

        var value = Math.max(65, Math.min(199,d3.event.x));



        var sliderValue = sliderScale.invert(value);



        that.x = d3.scale.pow().exponent(sliderValue/(d3.max(that.displayData.total)))
            .range([0,that.width - 75])



        that.xAxis = d3.svg.axis()
            .scale(that.x)
            .orient("bottom")
            .tickFormat(d3.format(".2s"))


        d3.select(this)
            .attr("x", function () {
                return sliderScale(sliderValue);
            })

        that.wrangledata(that.selected_country)
    }
    var sliderDragBehaviour = d3.behavior.drag()
        .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class:"sliderGroup",
        "transform":"translate("+0+","+30+")"
    })

    sliderGroup.append("rect").attr({
        class:"sliderBg",
        x:60,
        y:465,
        width:150,
        height:10
    }).style({
        fill:"lightgray"
    })

    sliderGroup.append("rect").attr({
        "class":"sliderHandle",
        y:460,
        x:60,
        width:10,
        height:20
    }).style({
        fill:"#333333"
    }).call(sliderDragBehaviour)

}