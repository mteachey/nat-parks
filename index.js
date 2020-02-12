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

const apiKey = 'PKmFpAHJpUX4X9eR88Ov1Osjz5jaV6LInwbDthQ8';
const endPoint ='https://developer.nps.gov/api/v1/parks';

function formatParameters(param){
    //create the url with parameters 
    const queryitems = Object.keys(param).map(key=>`${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`);
    return queryitems.join('&');   
}

function getParks(state, max=10){
   // call a function to format the parameters with the user input
   //call the API using fetch
   //catch errors
   state = state.replace(/[ ,]+/g, ",");
   const params = {
    stateCode: state,
    limit: max,
    fields:'addresses',
    api_key: apiKey,   
    };
   const queryString = formatParameters(params);
   const url = endPoint + '?' + queryString;
  
   fetch(url)
    .then(response =>{
        if(response.ok){
            return response.json()
        }
        throw new Error(response.statusText);
    })
    .then(responseJson=>{
      
        displayResults(responseJson,state);
    })
    .catch(err => {
        $('#js-error-message').text(`Something went wrong. Double check your abbreviation.`)
     });

   
}

function getPhysicalAddress(responseJson,i){
 
  let addressNumber = responseJson.data[i].addresses.length;
   
  for (let j=0; j < addressNumber; j++){
     if (responseJson.data[i].addresses[j].type==='Physical'){
        
        return `${responseJson.data[i].addresses[j].line1} ${responseJson.data[i].addresses[j].line2} ${responseJson.data[i].addresses[j].city},${responseJson.data[i].addresses[j].stateCode} ${responseJson.data[i].addresses[j].postalCode}`;
    }//end of if   
  }//end of for
  return 'No Physical Address'
}

function displayResults(responseJson,state){
    //clear the results
    //display the results (full name, decrip, url, address)
  
    let length = responseJson.data.length;
    
    $('.results').empty();
    $('#js-error-message').empty();
    $('.results').append(`<h2>Your Results for ${state}</h2><ul class="results-list"></ul>`);
    for (let i=0;i<length;i++){
       
        let address = getPhysicalAddress(responseJson,i);
        
        $('.results-list').append(`<li><h3>National Park ${i+1}</h3><p>Name: ${responseJson.data[i].fullName}</p><p>Description: ${responseJson.data[i].description}</p><a href="${responseJson.data[i].url}">Link: ${responseJson.data[i].url}</a><p class="address">Physical Address:<br>${address}</p></li>`);

    }
    $('.results').removeClass('js-hidden');
   
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
       $('#state-name').val("");
       $('#max-results').val(10);
        getParks(state, max);
    });
}

$(watchForm);