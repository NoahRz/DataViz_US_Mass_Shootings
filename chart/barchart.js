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