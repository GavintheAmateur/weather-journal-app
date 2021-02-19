//constants
const weatherAPIAppid = '0b78a979660e620d1b8ad5f422f0c144';
const weatherAPIUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
const proxyUrl = 'https://cors-anywhere.herokuapp.com'
const appBaseUrl = 'http://localhost:5555'

//helper functions
const debug = msg => console.log(msg);
const logError = err => console.error(err);

const isValidUSZip= (sZip)=> /^\d{5}(-\d{4})?$/.test(sZip);

const insertHTML = (parentId, position, html) => document.getElementById(parentId).insertAdjacentHTML(position, html);
const removeInnerHTML = (id) => document.getElementById(id).innerHTML = '';
const updateInnerHTML = (id, html) => {
    removeInnerHTML(id);
    insertHTML(id, 'beforeend', html);
}


//business logic
const showDate = () => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today = new Date().toLocaleDateString('en-US', options);
    let hToday = `<span id="current-date">${today}</span>`;
    insertHTML('journal-header', 'afterbegin', hToday);
}

const showLoadingWeather = () => {
    let hLoading = `<span id="loading">Loading Weather...</span>`;
    updateInnerHTML('location-weather', hLoading);
}

const showWeather = (data) => {
    //debug(data);
    if (data) {
        const absoluteZero = -273.15;
        let temp = data.main.temp + absoluteZero;
        temp = parseFloat(temp).toFixed(1);
        let desc = data.weather[0].description;
        let weather = `${temp} ℃, ${desc}`;

        let eleLocation = document.getElementById('current-location')
        let country = data.sys.country;
        let city = data.name;
        let location = `${city}, ${country}`;

        let hLocationWeather = `
        <span id="current-location">${location}</span>
        <span id="current-weather">${weather}</span>
        `
        updateInnerHTML('location-weather', hLocationWeather);
    }

}

const showGettingWeatherFailure = (e) => {
    console.log(e);
    let hError = `<span>Getting weather failed. Check console for details.</span>`;
    updateInnerHTML('location-weather', hError);
}

const loadWeather = async (e) => {
    let zip = e.target.value;
    if (!isValidUSZip(zip)) {
        alert(`"${zip}" is not a valid US Zip Code, please re-enter.`);
        return;
    }
    let country = 'us';
    let url = `${weatherAPIUrl}?zip=${zip},${country}&appid=${weatherAPIAppid}`
    showLoadingWeather();
    //weather api response doc: https://openweathermap.org/current#current_JSON
    try {
        let resp = await fetch(url);
        let data = await resp.json();
        if (data.cod == 200) {
            showWeather(data);
        } else {
            showGettingWeatherFailure(data);
        }
        
    } catch (error) {
        showGettingWeatherFailure(error);
    }
}

const saveJournal = (e) => {
    let id = new Date().getMilliseconds();
    let date = document.getElementById('current-date').textContent;
    //allow user to save without weather and location fetched.
    let zip = document.getElementById('current-zip').value;
    let eleLocation = document.getElementById('current-location');
    let eleWeather = document.getElementById('current-weather');
    let location = eleLocation?eleLocation.textContent:'';
    let weather = eleWeather?eleWeather.textContent:'';
    let content = document.getElementById("current-content").value;

    if (zip && content) {
        let journal = {
            id: id,
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
                    updateInnerHTML('history-entries', htmlEntries);

                })
            .catch(error => logError(error))
            ;

    } else if (!zip) {
        alert("please input zip code before saving!");
    } else if (!content) {
        alert("please input journal content before saving!");
    }
}

//document ready => show date
document.addEventListener("DOMContentLoaded", showDate);
//input zip =>   load weather
const zipBox = document.getElementById('current-zip');
zipBox.addEventListener('focusout', loadWeather);
//click save => save journal
const generateBtn = document.getElementById('save');
generateBtn.addEventListener('click', saveJournal);
