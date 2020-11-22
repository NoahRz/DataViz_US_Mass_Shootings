import {USMassShootings} from '../src/utils.js';

 function reduce(data){
    let result = {}
    
    for(var i=0; i<data.length;i++){
        if(data[i].year in result) {
            result[data[i].year] = result[data[i].year] + 1
        
        }else {
            result[data[i].year] = 1
        }
    }
    
    return d3.entries(result);
} 

var dataset = USMassShootings.then(function(data){
    return reduce(data);
})

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 460 - margin.left - margin.right,
    height = 240 - margin.top - margin.bottom;

// append the svg object to the appropriate div of the page
var svg = d3.select("#line-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


 function linechart(data){

    // Add X axis
    var x = d3.scaleLinear() // scaleTime n'a pas marché pour moi : https://bl.ocks.org/LyssenkoAlex/1317e8dcf3d40f33b341552cf82a10b2 
      .domain(d3.extent(data, function(d) { 
        return d.key; })) // d3.extend returns the minimum and maximum value in an array from the given array 
      .range([ 0, width ]);
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
            .tickFormat(d3.format('.4r')));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; }) + 1])
        .range([ height, 0 ]);
    
    svg.append("g")
        .call(d3.axisLeft(y));


    // Add the area
    svg.append("path")
      .datum(data)
      .attr("fill", "#f59494")
      .style("fill-opacity", 0.2)
      .attr("stroke", "#f59494")
      .attr("stroke-width", 0)
      .attr("d", d3.area()
        .x(function(d) { return x(d.key) })
        .y0(y(0))
        .y1(function(d) { return y(d.value) })
        );
    
    // Add tje line
    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#f59494")
    .attr("stroke-width", 1.5)

    .attr("d", d3.line()
    .x(function(d) { return x(d.key) })
    .y(function(d) { return y(d.value) })
    )

    // Add dot for last element
     svg.append('g')
    .append("circle")
        .attr("cx", x(data[data.length-1].key) )
        .attr("cy", y(data[data.length-1].value) )
        .attr("r", 3)
        .style("fill", "#f59494")

}

dataset.then((data)=>{
    return linechart(data);
})

/* Test for scaleTime */
/*  function reduce(data){
    let result = {}
    
    for(var i=0; i<data.length;i++){
        //console.log(d3.timeParse("%Y")(data[i].year));
        if(d3.timeParse("%Y")(data[i].year) in result) {
            result[d3.timeParse("%Y")(data[i].year)] = result[d3.timeParse("%Y")(data[i].year)] + 1
        
        }else {
            result[d3.timeParse("%Y")(data[i].year)] = 1
        }
    }
    
    return d3.entries(result);
} */