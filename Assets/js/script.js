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
