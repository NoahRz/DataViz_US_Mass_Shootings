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

const USStates = loadjson(data1);
const USMassShootings = loadcsv(data2);


export {USStates, USMassShootings};