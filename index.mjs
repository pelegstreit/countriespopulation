// var Promise = require("bluebird");
// var fetch = require("node-fetch");
import fetch from "node-fetch";
import Promise from "bluebird";

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


//------------------------------
//   Sequential processing 
//------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];

function sequence() {
console.log ('start of seq run')
    // return new Promise((resolve,reject)=>{ })
    Promise.each(countries,  country => {
      return getCountryPopulation(country)
        .then( population => {
            console.log(`population of ${country} is ${population}`)
            return 'anything'
        })
        .then( population => console.log(`Done`))
        .catch(err=> console.log('Error in manual: ',err.message));
    })

}
// sequence();

//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------
function parallel() {
    Promise.map(countries, country => {
        console.log('start processing country:' ,country);
    return getCountryPopulation(country)
    .then ( population => {
        console.log(`population of ${country} is ${population}`)
        return 'anything'
    })
})
    .then( resultArray => {
        console.log('All tasks are done now...', countries);
    })
    .catch(err=> console.log('Error in manual: ',err.message)); 
}
parallel();