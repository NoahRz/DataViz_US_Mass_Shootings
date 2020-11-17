console.log('v3', d3version3.version)
console.log('v5', d3.version)

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

let USStates = '../data/us-states.json';

let dataset = loadjson(USStates);


var w = 1400;
var h = 700;

var svg = d3.select("div#d3-US-map")
.append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 " + w + " " + h)
.style("background","#fff")
.classed("svg-content", true);

var projection = d3version3.geo.albersUsa().translate([w/2, h/2]).scale([1000]);
var path = d3version3.geo.path().projection(projection);

// drawmap for multiple promises
/* Promise.all([dataset, dataset1, ...]).then(function(values){
    // draw map
 
    svg.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","states")
        .attr("d", path)
}); */

// drawmap for one promise
function drawMap(data){
    svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class","states")
    .attr("d", path);

}

dataset.then((data)=>{
    return drawMap(data);
})