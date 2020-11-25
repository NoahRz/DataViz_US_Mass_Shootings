import {USMassShootings} from '../src/utils.js';


function reduce(data){
    let result = {'white':0, 'black':0, 'latino':0, 'asian':0, 'other':0}
    
    for(var i=0; i<data.length;i++){
        if(data[i].race.toLowerCase() in result) {
            result[data[i].race.toLowerCase()] = result[data[i].race.toLowerCase()] + 1
        } else if (data[i].race.toLowerCase().localeCompare("native american") == 0){
            result["other"] = result["other"] + 1
        }
    }
    return d3.entries(result);
} 

var dataset = USMassShootings.then(function(data){
    return reduce(data);
})


var width = 300,
    height = 300,
    margin = 40;

    
var radius = Math.min(width, height) / 2 - margin;


var svg = d3.select("#ethnicity")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  function piechart(data){
      var color = d3.scaleLinear()
        .domain([-10, d3.max(data, function(d) { return +d.value; }) - 20])
        .range(["white", "red"])
  
      var pie = d3.pie()
        .value(function(d) {return d.value; });
      var data_ready = pie(data);

      var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

      var newarc = d3.arc()
        .innerRadius(3 * radius / 5)
        .outerRadius(radius);
  
      svg
        .selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.value)); })
        .attr("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", 0.7)

      svg
        .selectAll('slices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ return (d.data.key)})
        .attr("transform", function(d) { return "translate(" + newarc.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 15)

        svg
        .selectAll('slices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ return ((d.data.value/111*100).toFixed(1) + " %")})
        .attr("transform", function(d) { return "translate(" + newarc.centroid(d) + ")";  })
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", 15)
}    

dataset.then((data)=>{
    return piechart(data);
})