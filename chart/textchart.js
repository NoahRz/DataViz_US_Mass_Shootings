import {USMassShootings} from '../src/utils.js';

function getCurrentYear(data){
    return d3.max(data, function(d) { return +d.year; })
}

function getLastYear(data){
    return d3.max(data, function(d) { return +d.year; }) - 1;
}

function infoYear(data, year){
    var infoYear = {"key":year, "nb_case":0, "nb_fatalities":0, "nb_injured":0};
    for(var i=0; i<data.length;i++){
        if(data[i].year == year) {
            infoYear["nb_case"] = infoYear["nb_case"] + 1;
            infoYear["nb_fatalities"] = infoYear["nb_fatalities"] + parseInt(data[i].fatalities);
            infoYear["nb_injured"] = infoYear["nb_injured"] + parseInt(data[i].injured);
        }
    }
    return infoYear;
}

/* function infoYear(data, year){

    var currentYear = d3.max(data, function(d) { return +d.year; })
    var lastYear = currentYear -1;

    var dictCurrentYear = {"key":currentYear, "nb_case":0, "nb_fatalities":0, "nb_injured":0};
    var dictLastYear = {"key":lastYear, "nb_case":0, "nb_fatalities":0, "nb_injured":0};

    console.log("max year :", currentYear)
    console.log("last year:", lastYear)

    for(var i=0; i<data.length;i++){
        if(data[i].year == currentYear) {
            dictCurrentYear["nb_case"] = dictCurrentYear["nb_case"] + 1;
            dictCurrentYear["nb_fatalities"] = dictCurrentYear["nb_fatalities"] + parseInt(data[i].fatalities);
            dictCurrentYear["nb_injured"] = dictCurrentYear["nb_injured"] + parseInt(data[i].injured);
        
        }
        if(data[i].year == lastYear) {
            dictLastYear["nb_case"] = dictLastYear["nb_case"] + 1;
            dictLastYear["nb_fatalities"] = dictLastYear["nb_fatalities"] + parseInt(data[i].fatalities);
            dictLastYear["nb_injured"] = dictLastYear["nb_injured"] + parseInt(data[i].injured);
        }
    }
    console.log("current year",dictCurrentYear);
    console.log("last year",dictLastYear);
    return [dictCurrentYear, dictLastYear];
}  */
/* var currentNumberCases = USMassShootings.then(function(data){
    return currentNumberCases(data);
}) */

USMassShootings.then(function(data){
    return infoYear(data, 2020);
})

var currentYear = USMassShootings.then(function(data){
    return getCurrentYear(data);
})

var lastYear = USMassShootings.then(function(data){
    return getLastYear(data);
})

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 240 - margin.top - margin.bottom;

// append the svg object to the appropriate div of the page
var svg = d3.select("#text-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

Promise.all([currentYear, lastYear]).then(function(values){

     var infoCurrentYear = USMassShootings.then(function(data){
        return infoYear(data, values[0])
    })

    var infoLastYear = USMassShootings.then(function(data){
        return infoYear(data, values[1])
    })

    Promise.all([infoCurrentYear, infoLastYear]).then(function(values){

        var w_rect = 200;

        svg.selectAll("rect")
            .data([1, 2, 3])
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", 25)
            .attr("width", w_rect)
            .attr("height", 100)
            .attr("transform", d => "translate(" + (d-1) * w_rect + ",0)") // ATTENTION : le d ici est associé au données : 1, 2, 3
            .style("fill", "none")
            .attr("stroke", "black")
            .style("stroke-width", 0.5)

        svg.selectAll("mylabel")
            .data([1, 2, 3])
            .enter()
            .append("text")
            .attr("x", 0)
            .attr("y", 25)
            .attr("width", w_rect)
            .attr("height", 100)
            .attr("transform", d => "translate(" + ((d-1) * w_rect + w_rect/2) + ",50)") // ATTENTION : le d ici est associé au données : 1, 2, 3
            .text(function(d){ return (values[0].nb_case)})
            .style("font-size", 30)
 
    }) 


})
