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

let statesGeo = dataset.then(function(data){
    return filterGeo(data);
 });

 console.log(statesGeo);