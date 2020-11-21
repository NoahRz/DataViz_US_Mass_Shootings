function loadcsv(data){
    return d3.csv(data);
}

function loadjson(data){
    return d3.json(data);
}

function filterGeo(data){
    statesGeo = [];
    for(var i=0; i < data.features.length; i++){
        statesGeo.push(data.features[i].properties.name);
    }
    return statesGeo;
}

let data1 = '../data/us-states.json';
let data2 = '../data/Mother_Jones_Mass_Shootings_Database_1982_2020_Sheet1.csv';

let USStates = loadjson(data1);
let USMassShootings = loadcsv(data2);

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
.attr("z-index", 2);

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

Promise.all([USStates, USMassShootings]).then(function(values){
    // draw map
 
    svgMap.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","states")
        .attr("d", path)

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
    console.log(max);

    var size = d3.scaleSqrt()
    .domain([1, max])
    .range([2, Math.sqrt(max)*2])  // Size in pixel

    valuesToShow = [max, 0.5*max, 0.1*max]; //max, median, min

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