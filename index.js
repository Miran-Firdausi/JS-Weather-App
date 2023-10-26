const API_KEY = 'ede65d24dc92de6d31107cc6263234e1';
let cityName = "new delhi" // default

let currentWeatherByCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
let forecastByCityURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

const searchField = document.getElementById("searchBar");


window.onload = fetchData(currentWeatherByCityURL, forecastByCityURL);

document.getElementById("searchBtn").onclick = function() {
    if (!searchField.value) {
        alert("Please Enter City Name!");
    } else {
        cityName = searchField.value;
        currentWeatherByCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
        forecastByCityURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;
        fetchData(currentWeatherByCityURL, forecastByCityURL);
    }
}

function fetchData(currentWeatherRequestURL, forecastRequestURL){
    fetch(currentWeatherRequestURL).then((response) => {
            if (response.status !== 200) {
                alert("City Not Found!");
                throw new Error("Error loading Weather data: City not Found!");
            } else {
                return response.json()
            }
        })
    .then((data) => { updateCurrentWeather(data)}).catch(error => console.error(error));

    fetch(forecastRequestURL).then((response) => {
        if (response.status !== 200) {
            throw new Error("Error loading Forecast: City not Found!")
        }
        return response.json()})
    .then((data) => {updateForecast(data); updateHourForecast(data)}).catch(error => console.error(error));
}

function updateCurrentWeather(data) {

    document.querySelector(".temp-value").innerHTML = Math.floor(data.main.temp-273);
    document.querySelector(".overview__condition").innerHTML = data.weather[0].main;
    document.querySelector(".today-humidity").innerHTML = data.main.humidity+" %";
    document.querySelector(".today-pressure").innerHTML = data.main.pressure+" mb";
    document.querySelector(".today-wind-speed").innerHTML = data.wind.speed +" km/h";
    document.querySelector(".today__image").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.querySelector(".location").innerHTML = ` ${data.name}, ${data.sys.country}`;
}

function updateHourForecast(data) {
    for (let i=0; i<11; i++) {
        let date = parseDate(data.list[i].dt + data.city.timezone);
        document.querySelectorAll(".hourly-time")[i].innerHTML = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
        document.querySelectorAll(".hourly-temp-value")[i].innerHTML = Math.round(data.list[i].main.temp-273);    
    }
}

function updateForecast(data) {
    let forecasts = getUniqueForecasts(data.list, data.city.timezone);

    for (let i=0; i < 5; i++) {
        document.querySelectorAll(".slider-card__date")[i].innerHTML = forecasts[i].datevalue;  
        document.querySelectorAll("#forecastTempValue")[i].innerHTML =Math.round(forecasts[i].main.temp-273);
        document.querySelectorAll("#forecastCondition")[i].innerHTML = forecasts[i].weather[0].main;
        document.querySelectorAll(".forecast-humidity-value")[i].innerHTML =     forecasts[i].main.humidity;
        document.querySelectorAll(".forecast-windsp-value")[i].innerHTML = forecasts[i].wind.speed;
        document.querySelectorAll(".forecast-icon")[i].src = `http://openweathermap.org/img/wn/${forecasts[i].weather[0].icon}.png`;
    }

    document.querySelector(".today-pop-value").innerHTML = data.list[0].pop + " %";
}


function getUniqueForecasts(forecastList, timeDiff) {
    let uniqueForecasts = [];

    for (let i=2; i < forecastList.length; i+=8) {
        const date = parseDate((forecastList[i].dt + timeDiff));
        const dateString = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
        uniqueForecasts.push(forecastList[i]);
        forecastList[i]["datevalue"] = dateString;
    }

    return uniqueForecasts;
}

function parseDate(timestamp) {
    return new Date(timestamp * 1000);
}


document.querySelector(".current-location-btn").onclick = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
      
    function showPosition(position) {
        let lat = position.coords.latitude; 
        let lon = position.coords.longitude;

        const currentWeatherRequestURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const forecastRequestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        fetchData(currentWeatherRequestURL, forecastRequestURL);
    }
}
