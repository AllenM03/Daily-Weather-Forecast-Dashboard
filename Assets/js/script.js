var cityEntryEl = document.querySelector('#city-entry');
var cityInputEl = document.querySelector('#city-name');
var currentWeatherEl = document.querySelector('.current-weather-div');
var forecastEl = document.querySelector('.forecast-div');
var searchEl = document.querySelector('.search-div');
var APIkey = "ec41c2204e5399dfc35aa2f07e953c27";
// this function is a call to get the weather on a user entered city and:
// to get the lat and long of the entered city.
function getAPI(cityName) {
    var apiGeoCoding = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + APIkey;
    var i = 0;
    var cityNameSplit = ''

    fetch(apiGeoCoding).then(function (response) {
        if (!response.ok || !response) {
            if (!response) alert('Invalid City');
            return;
        }
        return response.json();
    })
        .then(function (locationData) {
            if (locationData) {
                // GeoCoding API returns a max of 5 locations from the cityName provided so to get the index to use, compare the whole name of the output to the one entered
                while (i < locationData.length) {
                    //if country code is entered, split the value and just use the first part to look for the approriate array to use in the next part
                    cityNameSplit = cityName.split(',');
                    cityName = (cityNameSplit.length > 1) ? cityNameSplit[0] : cityName;
                    if (locationData[i].name.toUpperCase() === cityName.toUpperCase()) {
                        break;
                    }
                    i++;
                }
                if (i < locationData.length) {
                    // get the city name in proper case so just copy the name and country code from the chosen array.
                    cityName = locationData[i].name+', '+locationData[i].country;
                    // the second one is the actual call to get the current and forecast weather of the city
                    // this is due to OneCall only accepting latitude and longitude values in its API call
                    var apiWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + locationData[i].lat + "&lon=" + locationData[i].lon + "&exclude=minutely,hourly,alerts&units=standard&appid=" + APIkey;
                    getWeather(apiWeatherUrl, cityName);
                } else {
                    // city entered does not match any of the returned data
                    alert('Invalid city');
                    return;
                }
            } else {
                alert('Invalid city');
                return;
            }
        });    
}

function getWeather(api, cityName) {    
    //moved function out of getAPI so that it can also be called when clicking the buttons
    fetch(api).then(function (response) {
        if (response.ok) {
            response.json().then(function (weatherData) {
                console.log(weatherData);
                // display current weather
                displayCurrentWeather(weatherData.current, cityName);
                // use daily[1] to daily[6] from the API response to show the 5-day forecast
                for (var i = 1; i < 6; i++){      
                    displayForecast(weatherData.daily[i],i);   
                }
                // create button for history
                createHistoryButton(cityName, api);
            })
        } else {
            alert("Can't find weather in " + cityName);
            return;
        }
    });
}

function displayCurrentWeather(resultObj, cityName) {
    if (!currentWeatherEl.hasChildNodes()) {
        //first time doing a search so create cards for the weather
        var resultCard = document.createElement('div');
        resultCard.classList.add('card', 'bg-light', 'text-dark', 'm-3', 'p-3', 'col-sm-11');
}