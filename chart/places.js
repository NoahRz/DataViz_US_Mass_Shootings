import {USMassShootings} from '../src/utils.js';


function reduce(data){
    let result = {}
    
    for(var i=0; i<data.length;i++){
        var loc = data[i].location
        loc = loc.replace("\n","")
        loc = loc.replace(/\s+/g,'');
        console.log("Loc:",loc);
        if(loc in result) {
            result[loc] = result[loc] + 1
        
        }else {
            result[loc] = 1
        }
    }
    result["Other"] = result["Other"] + result["Airport"] + result["Religious"];
    delete result["Airport"];
    delete result["Religious"];
    console.log(result);
    return d3.entries(result);
} 

var dataset = USMassShootings.then(function(data){
    return reduce(data);
})


var width = 300,
    height = 300,
    margin = 40;

    
var radius = Math.min(width, height) / 2 - margin;


var svg = d3.select("#places")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  function piechart(data){
      var color = d3.scaleOrdinal()
        .domain(data)
        .range(["#ee4e5a", "#ecda9a", "#a9dbda", "#2a5673"])
  
      var pie = d3.pie()
        .value(function(d) {return d.value; });
      var data_ready = pie(data);

      var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

      var newarc = d3.arc()
        .innerRadius(2 * radius / 3)
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
        .style("opacity", 0.9)

      svg
        .selectAll('slices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ return (d.data.key)})
        .attr("transform", function(d) { return "translate(" + newarc.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 16)

        svg
        .selectAll('slices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ return ((d.data.value/118*100).toFixed(1) + " %")})
        .attr("transform", function(d) { return "translate(" + newarc.centroid(d) + ")";  })
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", 16)
}    

dataset.then((data)=>{
    return piechart(data);
})