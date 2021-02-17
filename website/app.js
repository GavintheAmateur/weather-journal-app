/* Global Variables */

let weatherAPIAppid = '0b78a979660e620d1b8ad5f422f0c144';
let weatherAPIUrl =  new URL("https://api.openweathermap.org/data/2.5/weather");

/*
End global variables
Begin helper functions*/

const logAPICallError = err => console.warn(`ERROR ${err.code}: ${err.message}`);

/* Function to GET data */

const callAPI = async (url = '',method='GET',headers=headers,onSuccess=null,onFailure=null) => {
    try {
        const resp = await fetch(url, {
            method: method,
            credentials: '',
            headers: headers
        })
        onSuccess(resp);
    } catch (error) {
        logAPICallError(error);
        onFailure();
    }

}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    console.log(data)
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });

    try {
        const newData = await response.json();
        // console.log(newData);
        return newData
    } catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
}


/*
End helper functions.
Begin business logic:
*/

//1.fetch weather when page opens
//1.1 get current location

const renderWeatherFromResponse = resp => {
    let data = resp.body
    console.log("data retrieved in renderWeatherFromResponse"+data);
}
const onGetGeoSuccess = pos=> {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longgitude;
    params = {
        lat:lat,
        lon:lon,
        cnt:1
    }
    Object.keys(params).forEach(key=> weatherAPIUrl.searchParams.append(key,params[key]));
    callAPI(weatherAPIUrl,
        'GET',
        {
            'Content-Type': 'application/json',
        },
        renderWeatherFromResponse
        );
}

navigator.geolocation.getCurrentPosition(
    onGetGeoSuccess,
    logAPICallError,
    {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0      
    });
//2. fetch weather when manually input a zip

//3. save journal when clicking Generate button

const saveJournal = () => {

}
const generateBtn = document.getElementById('generate');
generateBtn.addEventListener('click', saveJournal);
