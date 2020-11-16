function loadcsv(data){
    return d3.csv(data);
}

const data = loadcsv('../data/Mother_Jones_Mass_Shootings_Database_1982_2020_Sheet1.csv')

console.log(data)