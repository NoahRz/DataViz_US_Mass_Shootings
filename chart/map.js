import {USStates, USMassShootings} from '../src/utils.js';

var w = 960;
var h = 500;

/* var svgMap = d3.select("div#d3-US-map")
.append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 " + w + " " + h)
.style("background","#fff")
.classed("svg-content", true); */

var svgMap = d3.select("div#d3-US-map")
.append("svg")
.attr("width", w)
.attr("height",h)
.classed("svg-content", true)

var projection = d3v3.geo.albersUsa().translate([w/2, h/2]).scale([1000]);
var path = d3v3.geo.path().projection(projection);

function maxCol(data){
    var max = 0;
    for(var i=0; i < data.length; i++){
       if (parseInt(data[i].total_victims)>max){ // parseInt to compare value, otherwise, "9" would always be the max (csv values are string)
           max = parseInt(data[i].total_victims);
       }
    }
    return max;
}

function reduce(data){
    let result = {}
    
    for(var i=0; i<data.length;i++){
        var state = getState(data[i].city_state);
        if(state in result) {
            result[state] = result[state] + parseInt(data[i].total_victims)
        
        }else {
            result[state] = parseInt(data[i].total_victims)
        }
    }
    
    return d3.entries(result);
}


function getState(text){
    text = text.replace(/\s+/g,'')
    text = text.split(",")[1];
    return text;
}

function removeSpaces(text){
    return text.replace(/\s+/g,'');
}

let dataset = USMassShootings.then(function(data){
    return reduce(data);
})

console.log(dataset)

Promise.all([USStates, USMassShootings, dataset]).then(function(values){
    // draw map
 
    var states = [];
    console.log(values[2].length)
    for (var i=0; i< values[2].length; i++){
        states.push(values[2][i].key);
    }
    console.log(states);

    function getVictims(usState){
        for (var i=0; i< values[2].length; i++){
            if (values[2][i].key == usState) {
                return values[2][i].value;
            }
        }
        return 0;
    }

    var myColor = d3.scaleLinear()
        .domain([-30, d3.max(values[2], function(d) { return +d.value; })])
        .range(["white", "grey"])

    svgMap.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","states")
        .attr("d", path)
        .attr("fill", function(d){
            var usState = removeSpaces(d.properties.name.toString());
            if(states.includes(usState)){
                var tot_victims = getVictims(usState)
                return myColor(tot_victims);
            }else{
                return "white";
            }
        })

    svgMap.selectAll("circle")
        .data(values[1])
        .enter()
        .append("circle")
        .attr("class", "circle")
            .attr("cx", function(d) {
                return projection([d.longitude, d.latitude])[0];
                ;})
            .attr("cy", function(d) {
                return projection([d.longitude, d.latitude])[1];
            })
            .attr("r", function(d) {
                return Math.sqrt(d.total_victims)*2;
            })
            .attr("fill", "#f59494")
            .style("opacity", 0.60)


    var xCircle = 230
    var xLabel = 380
    var yCircle = 330

    var max = maxCol(values[1]);
    max = d3.format('.1r')(max);

    var size = d3.scaleSqrt()
    .domain([1, max])
    .range([2, Math.sqrt(max)*2])  // Size in pixel

    var valuesToShow = [max, 0.5*max, 0.1*max]; //max, median, min

    // legend
    d3.select("div#d3-US-map")
        .append("svg")
        .attr("id", "svg-legend")
        .attr("width", 460)
        .attr("height", 460)
        .attr("z-index", 1)
        .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("circle")
                .attr("cx", xCircle)
                .attr("cy", function(d){ return yCircle - size(d) } )
                .attr("r", function(d){ return size(d) })
                .style("fill", "#EBBAB6")
                .attr("stroke", "#ff5959")

    // Add legend: segments
    d3.select("#svg-legend")
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
            .attr('x1', function(d){ return xCircle + size(d) } )
            .attr('x2', xLabel)
            .attr('y1', function(d){ return yCircle - size(d) } )
            .attr('y2', function(d){ return yCircle - size(d) } )
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'));

    // Add legend: labels
    d3.select("#svg-legend")
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
            .attr('x', xLabel)
            .attr('y', function(d){ return yCircle - size(d) } )
            .text( function(d){ return d } )
            .style("font-size", 15)
            .attr('alignment-baseline', 'middle')

});




// drawmap for one promise
/* function drawMap(data){
    svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class","states")
    .attr("d", path);

}

dataset.then((data)=>{
    return drawMap(data);
}) */

/*
test

function maxCol(data){
    var max = 0;
    console.log("truc", data[0]);
    for(var i=0; i < data.length; i++){
       if (parseInt(data[i].fatalities)>max){ // parseInt to compare value, otherwise, "9" would always be the max (csv values are string)
           max = parseInt(data[i].fatalities);
       }
    }
    return max;
}

let max = USMassShootings.then(function(data){
    return maxCol(data);
})
*/