'use strict';
//run the function that listens for form submission on page load
//listen for form submission
//prevent default
//retrieve input data (one or more states, max results)
//pass this input to a function that will call the parks api
// call a function to format the parameters with the user input
//create the url with parameters 
//call the API using fetch
//catch errors
//clear the results
//display the results (full name, decrip, url, address)
//https://developer.nps.gov/api/v1/parks?stateCode=CO,VA&limit=2&api_key=PKmFpAHJpUX4X9eR88Ov1Osjz5jaV6LInwbDthQ8


const apiKey = 'PKmFpAHJpUX4X9eR88Ov1Osjz5jaV6LInwbDthQ8';
const endPoint ='https://developer.nps.gov/api/v1/parks';

function formatParameters(param){
    //create the url with parameters 
    const queryitems = Object.keys(param).map(key=>`${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`);
    console.log(`formatParameters ran`);
    return queryitems.join('&');   
}



function getParks(state, max=10){
   // call a function to format the parameters with the user input
   //call the API using fetch
   //catch errors
  
   const params = {
    stateCode: state,
    limit: max,
    api_key: apiKey,   
    };
   const queryString = formatParameters(params);
   const url = endPoint + '?' + queryString;
   console.log(url);

   fetch(url)
    .then(response =>{
        if(response.ok){
            return response.json()
        }
        throw new Error(response.statusText);
    })
    .then(responseJson=>{
        console.log(responseJson);
        displayResults(responseJson);
    })
    .catch(err => {
        $('#js-error-message').text(`Something went wrong. Double check your abbreviation.`)
     });

   console.log(`getParks ran`);
}


function displayResults(responseJson){
    //clear the results
    //display the results (full name, decrip, url, address)
    let length = responseJson.data.length;
    console.log(responseJson.data[0].fullName);
    $('.results').empty();
    $('#js-error-message').empty();
    $('.results').append(`<h2>Your Results</h2><ul class="results-list"></ul>`);
    for (let i=0;i<length;i++){
        $('.results-list').append(`<li><h3>National Park ${i+1}</h3><p>Name: ${responseJson.data[i].fullName}</p><p>Description: ${responseJson.data[i].description}</p><a href="${responseJson.data[i].url}">Link: ${responseJson.data[i].url}</a></li>`);
    }
    $('.results').removeClass('js-hidden');
    console.log(`displayResults ran`);
}



function watchForm(){
    //listen for form submission
    //retrieve input data (one or more states, max results)
    //pass this input to a function that will 
    //call the parks api
    $('#park-form').submit(function(event){
        event.preventDefault();
        let state = $('#state-name').val();
        const max = $('#max-results').val();
        console.log(typeof(state));
        state = state.replace(/[ ,]+/g, ",");
        console.log(`this is the state input ${state}`);

        getParks(state, max);
    });
   
    console.log(`watchForm ran`);
}

$(watchForm);