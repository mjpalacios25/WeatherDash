
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


$(document).ready(function(){

//functions to build URLs
function buildCurrentWeatherURL(){
    currentWeatherParam.q = $("#searchInput").val().trim();
    currentWeatherParam.units = "imperial";
    currentWeatherParam.appid = apiid;

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
    //localStorage.setItem("cityNames", JSON.stringify($("#searchInput").val().trim()))
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
        //cities.push($("#searchInput").val().trim());
        for(i=0 ; i < cities.length; i++){
        var newLi = $("<li class = 'list-group-item'>").text(cities[i]);
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
        var newLi = $("<li class = 'list-group-item'>").text($("#searchInput").val().trim());
        pastSearchesEl.append(newLi)
}


//click events and AJAX calls

getCities();


$("#searchButton").on("click", function(){
    //event.preventDefault();
    clear();
    saveLocal();
    //getCities();
    addCity();
    console.log(cities);
    console.log(typeof cities)
    console.log(localStorage.getItem("cityNames"))

    var mainWeatherURL = buildCurrentWeatherURL();
    
    $.ajax({
        url: mainWeatherURL,
        method: "GET"
        }).then(function(response) {
        lat = response.coord.lat;
        lon = response.coord.lon;

        var uvURL = buildUvURL();
        var fiveDayURL = buildforecastURL();

        console.log(response);
        

        var currentWeatherHeader = $("<h2>").text(response.name + " " + moment.unix(response.dt).format("M/D/YYYY"));
        var weathericon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png")
        var currentWeatherTemp = $("<p>").text("Temperature: " + response.main.temp + " F");
        var currentWeatherHumid = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var currentWeatherWind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
        //currentWeatherEl.append("<h2>" +  response.name + " " + moment.unix(response.dt).format("M/D/YYYY") + "<img src= http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png>" +"</h2>");
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

                forecastEl.append($("<h2>").addClass("col-md-12").text("5 Day Forecast"));

                for(i = 3; i < fiveDayResponse.list.length; i+=8){
                    var newDiv = $("<div>").addClass("col-md-2 rounded bg-primary mx-2 pt-2 text-left");
                    var newDate = $("<h6>").text(moment.unix(fiveDayResponse.list[i].dt).format("M/D/YYYY"));
                    var newIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + fiveDayResponse.list[i].weather[0].icon + ".png");
                    var newTemp = $("<p>").text("Temperature: " + fiveDayResponse.list[i].main.temp + " F");
                    var newHumid = $("<p>").text("Temperature: " + fiveDayResponse.list[i].main.humidity + "%");

                    newDiv.append(newDate, newIcon, newTemp, newHumid);
                    forecastEl.append(newDiv)

                }
            })

        });

     
   
    
});

})