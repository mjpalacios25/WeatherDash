
var pastSearchesEl = $("#pastSearches");
var cities 
var currentWeatherEl = $("#currentWeatherInfo");
var forecastEl = $("#forecastInfo");

var currentWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?";
var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?";
var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?";

var currentWeatherParam = {};
var uvIndexParam = {"APPID" : "20912c814361943ea6f62b43e249f46f"};
var fiveDayParam = {"APPID" : "20912c814361943ea6f62b43e249f46f"};
var apiid = "20912c814361943ea6f62b43e249f46f";
var lat;
var lon;
//will create name and coordinate variables within build url function.

$(document).ready(function(){
//functions to build URLs
function buildCurrentWeatherURL(){
    currentWeatherParam.q = $("#searchInput").val().trim();
    currentWeatherParam.units = "imperial";
    currentWeatherParam.appid = apiid;

    console.log(currentWeatherParam);
    var currentWeatherCall = currentWeatherUrl + $.param(currentWeatherParam);

    console.log(currentWeatherCall)
}

function buildUvURL(){
    uvIndexParam.lat = lat;
    uvIndexParam.lon = lon;
    uvIndexParam.units = "imperial";

    console.log(uvIndexParam);
    var uvCall = uvIndexUrl + $.param(uvIndexParam);

    console.log(uvCall)
}

function buildforecastURL(){
    fiveDayParam.lat = lat;
    fiveDayParam.lon = lon;
    fiveDayParam.units = "imperial";


    console.log(fiveDayParam);
    var fiveDayCall = forecastUrl + $.param(fiveDayParam);

    console.log(fiveDayCall)
}



//functions to save to past searches
function saveLocal(){
    //localStorage.setItem("cityNames", JSON.stringify($("#searchInput").val().trim()))
    localStorage.setItem("cityNames", JSON.stringify(cities))
}

function getCities(){
    var storedCities = JSON.parse(localStorage.getItem("cityNames"));

    if(storedCities !== null){
        cities = [];
        cities.push($("#searchInput").val().trim())
    } else {
        cities = []
        cities = $("#searchInput").val().trim()
    };

   //addCity();

}


//function to clear contents of current weather and forecast
function clear(){
    currentWeatherEl.empty();
    forecastEl.empty()
}

//funtion to create list of past searches
function addCity(){
        var newLi = $("<li class = 'list-group-item'>").text($("#searchInput").val().trim());
        pastSearchesEl.append(newLi)
}


//click events and AJAX calls
getCities();


$("#searchButton").on("click", function(){
    //clear goes first.. maybe also prevent default
    //event.preventDefault();
    //clear();
    saveLocal();
    getCities();
    console.log(cities);
    console.log(typeof cities)
    console.log(localStorage.getItem("cityNames"))

    var mainWeatherURL = buildCurrentWeatherURL();
    var uvURL = buildUvURL();
    var fiveDayURL = buildforecastURL();
  
    $.ajax({
        url: mainWeatherURL,
        method: "GET"
        }).then(function(response) {
        console.log(response)


        })
    
});

})