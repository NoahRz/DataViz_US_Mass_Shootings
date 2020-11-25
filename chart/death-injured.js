import {USMassShootings} from '../src/utils.js';

 function reduce(data){
    let fatalities = {}
    let injured = {}
    
    for(var i=0; i<data.length;i++){
        if(data[i].year in fatalities) {
            fatalities[data[i].year] = fatalities[data[i].year] + parseInt(data[i].fatalities)
        }else {
            fatalities[data[i].year] = parseInt(data[i].fatalities)
        }

        if(data[i].year in injured) {
            injured[data[i].year] = injured[data[i].year] + parseInt(data[i].injured)
        }else {
            injured[data[i].year] = parseInt(data[i].injured)
        }
    }
    
    return [d3.entries(fatalities),d3.entries(injured)];
} 

var dataset = USMassShootings.then(function(data){
    console.log(reduce(data))
    return reduce(data);
})

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the appropriate div of the page
var svg = d3.select("#death-injured")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


 function linechart(data){

    // Add X axis
    var x = d3.scaleLinear() // scaleTime n'a pas marché pour moi : https://bl.ocks.org/LyssenkoAlex/1317e8dcf3d40f33b341552cf82a10b2 
      .domain(d3.extent(data[1], function(d) {return d.key; })) // d3.extend returns the minimum and maximum value in an array from the given array 
      .range([ 0, width ]);
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
            .tickFormat(d3.format('.4r')));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data[1], function(d) { return +d.value; }) + 1])
        .range([ height, 0 ]);
    
    svg.append("g")
        .call(d3.axisLeft(y));


    // Add the lines
    svg.append("path")
    .datum(data[0])
    .attr("fill", "none")
    .attr("stroke", "#f59494")
    .attr("stroke-width", 1.5)

    .attr("d", d3.line()
    .x(function(d) { return x(d.key) })
    .y(function(d) { return y(d.value) })
    )

    svg.append("path")
    .datum(data[1])
    .attr("fill", "none")
    .attr("stroke", "#1a73e8")
    .attr("stroke-width", 1.5)

    .attr("d", d3.line()
    .x(function(d) { return x(d.key) })
    .y(function(d) { return y(d.value) })
    )

    // Add dot for last element
     svg.append('g')
    .append("circle")
        .attr("cx", x(data[0][data[0].length-1].key) )
        .attr("cy", y(data[0][data[0].length-1].value) )
        .attr("r", 3)
        .style("fill", "#f59494")

     svg.append('g')
    .append("circle")
    .attr("cx", x(data[1][data[1].length-1].key) )
    .attr("cy", y(data[1][data[1].length-1].value) )
    .attr("r", 3)
    .style("fill", "#1a73e8")


    //LEGEND
    svg.append("circle")
    .attr("cx",30)
    .attr("cy",24)
    .attr("r", 6)
    .style("fill", "#f59494")

    svg.append("circle")
    .attr("cx",30)
    .attr("cy",44)
    .attr("r", 6)
    .style("fill", "#1a73e8")
    
    svg.append("text")
    .attr("x", 40)
    .attr("y", 30)
    .attr("class", "legend")
    .text("fatalities");

    svg.append("text")
    .attr("x", 40)
    .attr("y", 50)
    .attr("class", "legend")
    .text("injured");

}

dataset.then((data)=>{
    return linechart(data);
})
