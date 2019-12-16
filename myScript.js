
var pastSearchesEl = $("#pastSearches");
var cities = []
var currentWeatherEl = $("#currentWeatherInfo");
var forecastEl = $("#forecastInfo");

var currentWeathUrl = "api.openweathermap.org/data/2.5/weather?";
var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?";
var forecastUrl = "api.openweathermap.org/data/2.5/forecast?";

var currentWeatherParam = {"APPID" : "20912c814361943ea6f62b43e249f46f"};
var uvIndexParam = {"APPID" : "20912c814361943ea6f62b43e249f46f"};
var fiveDayParam = {"APPID" : "20912c814361943ea6f62b43e249f46f"};
//will create name and coordinate variables within build url function.

$(document).ready(function(){
//functions to build URLs
function buildCurrentWeatherURL(){
    currentWeatherParam.q = $("#searchInput").val().trim();
    currentWeatherParam.units = "imperial";

    console.log(currentWeatherParam);
    var currentWeatherCall = currentWeathUrl + $.param(currentWeatherParam);

    console.log(currentWeatherCall)
}



//functions to save to past searches
function saveLocal(){
    localStorage.setItem("cityNames", JSON.stringify($("#searchInput").val().trim()))
}

function getCities(){
    var storedCities = JSON.parse(localStorage.getItem("cityNames"));

    if(storedCities !== null){
        //cities = [];
        cities.push($("#searchInput").val().trim())
    } else {
        cities
    }
}


//function to clear contents of current weather and forecast
function clear(){
    currentWeatherEl.empty();
    forecastEl.empty()
}

//funtion to create list of past searches
function pastSearches(){
    for(i = 0; i < cities.length; i++) {
        var newLi = $("<li class = 'list-group-item'>").text(cities[i]);
        pastSearchesEl.append(newLi)
    }
}

function addCity(){
        var newLi = $("<li class = 'list-group-item'>").text($("#searchInput").val().trim());
        pastSearchesEl.append(newLi)
}


//click events and AJAX calls

$("#searchButton").on("click", function(){
    //clear goes first.. maybe also prevent default
    //event.preventDefault();
    clear();
    saveLocal();
    getCities();
    addCity();
    console.log(cities);
    console.log(typeof cities)

    buildCurrentWeatherURL();
    console.log(currentWeatherParam)
});

})