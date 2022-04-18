//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}


var searchBtn = document.getElementById('searchBtn');
var currentDiv = document.getElementById("current")
var future = document.getElementById('futureWeather');
var searchCity = document.getElementById('searchCity');

// openweather api key
var apiKey = 'e79c76975ad2637930a749ca25f1b0f0';

var getCurrentWeather = function(input) {

    document.getElementById('current').style.display = 'block';

    var input = document.getElementById("searchCity").value;

    // var url = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + apiKey + "&units=imperial";

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + apiKey + "&units=imperial")
    .then(
        (response ) => {
            return response.json()}
        ).then((data) => {
            console.log(data)

            //creating card container
            var card = document.createElement("div");
            card.classList.add("currentWeather");

            var title = document.createElement("h3");
            title.classList.add("cityName");
            title.textContent = input + " ";

            var image = document.createElement('img')
            image.src = "http://openweathermap.org/img/w/" + iconPic + ".png";
            var iconPic = data.weather[0].icon;

            var temp = document.createElement("p");
            temp.textContent = "Temp: " + data.main.temp + " F";

            var wind = document.createElement("p");
            wind.textContent = "Wind: " + data.wind.speed + " Mph";

            var humidity = document.createElement("p");
            humidity.textContent = "Humidity: " + data.main.humidity + " %";

            var todayDate = document.createElement('h2');
            todayDate.innerHTML =  moment().format('MMMM Do YYYY');

            card.append(todayDate, image, title, temp, wind, humidity);
            currentDiv.append(card);

            var lat = data.coord.lat;
            var long = data.coord.lon;

            // var uvIndex = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=" + apiKey;

            fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=" + apiKey)
            .then((response) => {
                return response.json()
            }).then((data) => {
                // console.log(data);

            var uvValue = data.current.uvi;

            document.getElementById('currentWeather');

            var index = document.createElement("p");
            index.textContent = "UV Index: " + uvValue;
       
            card.append(index);

            if (uvValue > 0 && uvValue <= 3.5){
                index.classList.add('low');
              } else if (uvValue > 3.5 &&  uvValue <= 6.5){
                index.classList.add("moderate");
              } else if (uvValue > 6.5 &&  uvValue <= 10){
                index.classList.add("high");
              } else if (uvValue > 10){
                index.classList.add('extreme');
              }


            var fiveDay = [1, 2, 3, 4 ,5];

            for (var i = 0; i < fiveDay.length; i++) {

                var weekly = document.createElement('div')
                weekly.classList.add('forecast');
                weekly.classList.add('col-md-2');

                var image = document.createElement('img')
                image.src = "https://openweathermap.org/img/w/" + iconPic + ".png";
                var iconPic = data.daily[i].weather[0].icon;

                var date = document.createElement('h5');
                date.innerHTML = moment.unix(data.daily[i].dt).format('MM/DD/YY');

                var dailyTemp = document.createElement('p')
                var tempEl = Math.round(((parseFloat(data.daily[i].temp.day)-273.15)*1.8)+32) + ' F';   
                dailyTemp.textContent = "Temperature: " + tempEl;

                var windEl = document.createElement('p');
                windEl.textContent = "Wind Speed: " + data.daily[i].wind_speed + ' Mph';
                
                var humidEl = document.createElement('p');
                humidEl.textContent = 'Humidity: ' + data.daily[i].humidity + ' %';
                
                weekly.append(date, image, dailyTemp, humidEl, windEl);
                future.append(weekly);
              }
            })
            clearWeekly()
        });
        clearData();
    };

    function clearData () {
        while (currentDiv.firstChild) {
            currentDiv.removeChild(currentDiv.firstChild);
        }
    }
    
    function clearWeekly () {
        while(future.firstChild) {
            future.removeChild(future.firstChild);
        }
    }

    var cityArr = localStorage.getItem('history') || [];

    function getSearch( ) {
        var city = document.getElementById('searchCity').value;
        // console.log(city);

        getCurrentWeather(city);
        makeRow(city);
    };
     

    function makeRow(city) {
    
        //check to see if current search value exists in history 
        if(cityArr.indexOf(city) === -1){
            cityArr.push(city);
            localStorage.setItem('history', JSON.stringify(cityArr))
        }
        // if it dosent push into history array
        if(cityArr.length > 0){
            for (let i = 0; i < cityArr.length; i++) {
                var list = document.createElement('div')
                list.classList.add('ul');

                var cities = document.createElement('button');
                cities.innerHTML = cityArr[i].value
                
                list.append(cities);
                searchCity.append(list);
            }
        }
    }


searchBtn.addEventListener('click', getCurrentWeather)