
var pastSearchesEl = $("#pastSearches");
var cities 
var currentWeatherEl = $("#currentWeatherInfo");
var forecastEl = $("#forecastInfo");

var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
var uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?";

var currentWeatherParam = {"APPID" : "20912c814361943ea6f62b43e249f46f"};
var uvIndexParam = {"APPID" : "20912c814361943ea6f62b43e249f46f"};
var fiveDayParam = {"APPID" : "20912c814361943ea6f62b43e249f46f"};
var lat;
var lon;


$(document).ready(function(){

//functions to build URLs
function buildCurrentWeatherURL(cityName){
    
    //currentWeatherParam.q = $("#searchInput").val().trim();
    currentWeatherParam.q = cityName;
    currentWeatherParam.units = "imperial";

    console.log(currentWeatherParam);
    var currentWeatherCall = currentWeatherUrl + $.param(currentWeatherParam);
    
    console.log(currentWeatherCall);
    return currentWeatherCall;
}

function buildUvURL(){
    uvIndexParam.lat = lat;
    uvIndexParam.lon = lon;
    uvIndexParam.units = "imperial";

    console.log(uvIndexParam);
    var uvCall = uvIndexUrl + $.param(uvIndexParam);

    console.log(uvCall);
    return uvCall;
}

function buildforecastURL(){
    fiveDayParam.lat = lat;
    fiveDayParam.lon = lon;
    fiveDayParam.units = "imperial";


    console.log(fiveDayParam);
    var fiveDayCall = forecastUrl + $.param(fiveDayParam);

    console.log(fiveDayCall);
    return fiveDayCall;
}



//functions to save to past searches
function saveLocal(){
    if(!cities){
        cities = []
    } else{
       cities.push($("#searchInput").val().trim());
    localStorage.setItem("cityNames", JSON.stringify(cities)) 
    }

    
}

function getCities(){
    var storedCities = JSON.parse(localStorage.getItem("cityNames"));
    console.log(storedCities)

    if(storedCities){
        cities = storedCities;
        console.log(cities)
        for(i=0 ; i < cities.length; i++){
        var newLi = $("<li class = 'list-group-item pastCities btn'>").text(cities[i]);
        pastSearchesEl.append(newLi)
        }
    } 

}


//function to clear contents of current weather and forecast
function clear(){
    currentWeatherEl.empty();
    forecastEl.empty()
}

//funtion to create list of past searches
function addCity(){
        var newLi = $("<li class = 'list-group-item pastCities btn'>").text($("#searchInput").val().trim());
        pastSearchesEl.append(newLi)
}


//AJAX calls

function runWeather(response){
    
    lat = response.coord.lat;
    lon = response.coord.lon;

    var uvURL = buildUvURL();
    var fiveDayURL = buildforecastURL();

    console.log(response);
    


    var currentWeatherHeader = $("<h2>").text(response.name + " " + moment.unix(response.dt).format("M/D/YYYY"));
    var weathericon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png")
    var currentWeatherTemp = $("<p>").text("Temperature: " + response.main.temp + " F");
    var currentWeatherHumid = $("<p>").text("Humidity: " + response.main.humidity + "%");
    var currentWeatherWind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
    currentWeatherHeader.append(weathericon);
    currentWeatherEl.append(currentWeatherHeader, currentWeatherTemp, currentWeatherHumid, currentWeatherWind)

        $.ajax({
                url: uvURL,
                method: "GET"
                }).then(function(uvResponse) {
                var uvIndexP = $("<p>").text("UV Index: ");
                var uvIndexVal = $("<span>").addClass("btn btn-danger").text(uvResponse.value);
                uvIndexP.append(uvIndexVal);
                currentWeatherEl.append(uvIndexP)

                })
    $.ajax({
        url: fiveDayURL,
        method: "GET"
        }).then(function(fiveDayResponse) {
            console.log(fiveDayResponse.list);

            forecastEl.css({"display" : "flex"});
            forecastEl.append($("<h2>").addClass("col-md-12 mb-3").text("5 Day Forecast"));

            for(i = 6; i < fiveDayResponse.list.length; i+=8){
                var newDiv = $("<div>").addClass("col-sm-12 col-md-2 rounded mx-2 pt-2 text-center text-white mx-auto forecastSquare");
                var newDate = $("<h6>").text(moment.unix(fiveDayResponse.list[i].dt).format("M/D/YYYY"));
                var newIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + fiveDayResponse.list[i].weather[0].icon + "@2x.png");
                var newTemp = $("<p>").text("Temp: " + fiveDayResponse.list[i].main.temp.toFixed(0) + " F");
                var newHumid = $("<p>").text("Humidity: " + fiveDayResponse.list[i].main.humidity + "%");

                newDiv.append(newDate, newIcon, newTemp, newHumid);
                forecastEl.append(newDiv);
                console.log(fiveDayResponse.list[i])

            }
        })



}
// run on start and click events
//localStorage.clear()
getCities();


$("#searchButton").on("click", function(){
    event.preventDefault();
    clear();
    saveLocal();
    addCity();
    console.log(cities);
    console.log(typeof cities)
    console.log(localStorage.getItem("cityNames"))

    var mainWeatherURL = buildCurrentWeatherURL($("#searchInput").val());
    console.log($("#searchInput").val());
    
    $.ajax({
        url: mainWeatherURL,
        method: "GET"
        }).then(runWeather)
});

$(".pastCities").on("click", function(){
    clear();

    var mainWeatherURL = buildCurrentWeatherURL($(this).text());
    console.log($(this).text())

    $.ajax({
        url: mainWeatherURL,
        method: "GET"
        }).then(runWeather)
})

})
        