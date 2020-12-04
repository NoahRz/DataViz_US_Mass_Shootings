import {USMassShootings} from '../src/utils.js';

function reduce(data){ // group shooter by age class
    let result = {}
    
    for(var i=0; i<data.length;i++){
        if(!isNaN(data[i].age_of_shooter)){
            let age1 = parseInt(d3.format('.1r')(data[i].age_of_shooter)); // convert to it
            let age2 = age1 + 10;
            let interval = age1 + "-"+ age2;
            if(interval in result) {
                result[interval] = result[interval] + 1
            
            }else {
                result[interval] = 1
            }
        }
    }
    console.log(result);
    return d3.entries(result);
} 

function sort(data){ // group array by age class

    for(var i=0; i<data.length;i++){
        var min_idx=i;
        for (var j= i + 1; j<data.length;j++){
            if(parseInt(data[min_idx].key.substring(0,2)) > parseInt(data[j].key.substring(0,2))){
                min_idx = j
            }
        }
        var swap = data[i];
        data[i] = data[min_idx];
        data[min_idx]= swap;
    
    }
}

var dataset = USMassShootings.then(function(data){
    return reduce(data);
})

dataset.then(function(data){
    return sort(data);
})

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function barchart(data){

    var myColor = d3.scaleLinear()
                    .domain([-10, d3.max(data, function(d) { return +d.value; }) + 5])
                    .range(["white", "red"])

    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.key; }))
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(10,0)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.value; }) + 5]) // + 5 to add some space after the max value
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d){return myColor(d.value); })

    }

dataset.then((data)=>{
    return barchart(data);
})