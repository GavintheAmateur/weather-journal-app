/* Global Variables */

const weatherAPIAppid = '0b78a979660e620d1b8ad5f422f0c144';
const weatherAPIUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
const proxyUrl = 'https://cors-anywhere.herokuapp.com'
const appBaseUrl = 'http://localhost:5555'
/*
End global variables
Begin helper functions*/
const debug = msg => console.log(msg);
const logAPIError = err => console.error(err);
/*
End helper functions.
Begin business logic:
*/

const showDate = () => {
    const d = new Date().toLocaleDateString();
    let eleDate = document.getElementById('current-date');
    eleDate.textContent = d;
}
const fetchAndDisplayWeatherAndLocationByZip = e => {
    const showWeather = (resp) => {
        if (resp) {
            debug(resp);

            //render weather
            const absoluteZero = -273.15;
            let temp = resp.main.temp + absoluteZero;
            temp = parseFloat(temp).toFixed(1);
            let weather = resp.weather[0].description;
            let eleWeather = document.getElementById('current-weather');
            let h = `${temp} ℃, ${weather}`;
            eleWeather.textContent = h;
            //render location
            let eleLocation = document.getElementById('current-location')
            let country = resp.sys.country;
            let city = resp.name;
            let l = `${city}, ${country}`;
            eleLocation.textContent = l
        }
        //weather api response doc: https://openweathermap.org/current#current_JSON

    }

    let zip = e.target.value;
    let country = 'us';
    let url = `${proxyUrl}/${weatherAPIUrl}?zip=${zip},${country}&appid=${weatherAPIAppid}`
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(resp => resp.json())
        .then(data => showWeather(data)
        ).catch(error => console.log(error));
}

const publishJournal = (e) => {

    debug("hi")
    let date = document.getElementById('current-date').textContent;
    let zip = document.getElementById('current-zip').value;
    let location = document.getElementById('current-location').textContent;
    let weather = document.getElementById('current-weather').textContent;
    let content = document.getElementById('current-content').value;
    let id = new Date().getMilliseconds();

    if (zip && content) {
        let journal = {
            id:id,
            date: date,
            zip: zip,
            location: location,
            weather: weather,
            content, content
        };

        let url = appBaseUrl + '/journal/save'
        fetch(
            url,
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(journal)
            }
        )
            .then(resp => resp.json())
            .then(
                entries => {
                    let eleEntries = document.getElementById('history-entries');
                    let htmlEntries = entries.sort().reverse().map(
                        entry => `
                            <div class="history-entry">
                                <div class="history-entry-header">
                                <span id="entry-date">${entry.date}</span>
                                <span id="entry-zip">${entry.zip}</span>
                                <span id="entry-location">${entry.location}</span>
                                <span id="entry-weather">${entry.weather}</span>
                            </div>
                            <div class="history-entry-content id="entry-content">${entry.content}</div>
                            </div>
                        `
                    );
                    eleEntries.innerHTML='';
                    htmlEntries.forEach(
                        h => eleEntries.insertAdjacentHTML('beforeend', h)
                    );

                })
            .catch(error => logAPIError(error))
            ;

    } else if (!zip) {
        alert("please input zip code before publishing!");
    } else if (!content) {
        alert("please input journal content before publishing!");
    }






}
//onload show date
document.addEventListener("DOMContentLoaded", showDate);
//listener to fetch weather 
const zipBox = document.getElementById('current-zip');
zipBox.addEventListener('focusout', fetchAndDisplayWeatherAndLocationByZip);

//listner to save journal
const generateBtn = document.getElementById('publish');
generateBtn.addEventListener('click', publishJournal);
