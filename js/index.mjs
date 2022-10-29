// var Promise = require("bluebird");
// var fetch = require("node-fetch");
import fetch from "node-fetch";
// import Promise from "bluebird";

function getCountryPopulation(country){
    return new Promise((resolve,reject)=> {
        const url = `https://countriesnow.space/api/v0.1/countries/population`;
        const options = {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({country})
        };
        fetch(url,options)
            .then(res => res.json())
            .then(json => {
                if (json?.data?.populationCounts) resolve(json.data.populationCounts.at(-1).value);
                else reject(new Error(`My Error: no data for ${country}`)) //app logic error message
            })
            .catch(err => reject(err)) // network error - server is down for example...
            // .catch(reject)  // same same, only shorter... 
    })
}
async function asyncGetCountryPopulation(country){
    try{
    const url = `https://countriesnow.space/api/v0.1/countries/population`;
    const options = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({country})
    };
    const res = await fetch(url,options)
    const json = await res.json()
    if (json?.data?.populationCounts){
       return json.data.populationCounts.at(-1).value
    }
    else{throw new Error(`My Error: no data for ${country}`)} 
}
    catch(err){
        console.log(err)
        throw err
    } 
}


//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
function manual() {
    getCountryPopulation("France")
        .then( population => {
            console.log(`population of France is ${population}`);
            return getCountryPopulation("Germany")
        })
        .then( population => console.log(`population of Germany is ${population}`))
        .catch(err=> console.log('Error in manual: ',err.message));
}
// manual()
async function asyncmanual() {
    try{
        let population = await asyncGetCountryPopulation("France")
        console.log(`population of France is ${population}`);
        population =await asyncGetCountryPopulation("Germany")
        console.log(`population of Germany is ${population}`)
    }
    catch(err){
        console.log(err)
        throw err}
}
// asyncmanual()
//------------------------------
//   Sequential processing 
//------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];
// const countries = ["France","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Romania","Israel"];

function sequence() {
console.log ('start of seq run')
    // return new Promise((resolve,reject)=>{ })
    Promise.each(countries,  country => {
      return getCountryPopulation(country)
        .then( population => {
            console.log(`population of ${country} is ${population}`)
        })
        .catch(err=> console.log(`Error in ${country}:`,err.message))
        .then( population => console.log(`Done`))
        .catch(err=> console.log('Error in manual: ',err.message));
    })

}
async function asyncsequence() {
    try{
        (async ()=> {
            const allProm = []
            for (let country of countries){
                allProm.push(asyncGetCountryPopulation(country))
                let promcuntries = await Promise.allSettled(allProm)
                console.log (`population of ${country} is ${promcuntries[countries.indexOf(country)][`value`]} `)
            }
            console.log("all done!")
        })()
    }
    catch(err){
        console.log(err)
        // throw err
    } 
}
    
// sequence();
asyncsequence()
//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------
function parallel() {
    Promise.map(countries, country => {
        console.log('start processing country:' ,country);
    return getCountryPopulation(country)
    .catch(err=> console.log(`Error in ${country}: `,err.message))
    })
    .then ( population => {
        population.forEach((population, i )=>
        console.log(`population of ${countries[i]} is ${population}`))
    })
    .then( resultArray => {
        console.log('All tasks are done now...', countries);
    })
    .catch(err=> console.log('Error in manual: ',err.message)); 
}

async function asyncparallel() {
    try{
        console.log ('start of async-seq run')
        let promarr = countries.map(country => asyncGetCountryPopulation(country))
        let promcuntries = await Promise.allSettled(promarr)
       for(var i=0; i<countries.length; i++) {
        console.log(`population of ${countries[i]} is ${promcuntries[i][`value`]}`)
    }
        // console.log(promcuntries)
    }
    catch(err){
        console.log(err)
        throw err
    } 
}
// parallel();
// asyncparallel()