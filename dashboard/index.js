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

var w = 1400;
var h = 700;

var svg = d3.select("div#d3-US-map")
.append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 " + w + " " + h)
.style("background","#fff")
.classed("svg-content", true);

var projection = d3v3.geo.albersUsa().translate([w/2, h/2]).scale([1000]);
var path = d3v3.geo.path().projection(projection);

Promise.all([USStates, USMassShootings]).then(function(values){
    // draw map
 
    svg.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","states")
        .attr("d", path)

    svg.selectAll("circle")
        .data(values[1])
        .enter()
        .append("circle")
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