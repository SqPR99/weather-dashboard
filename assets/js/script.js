// Personal API key
let APIKey = "01a96430291977351412e136ae22e54a";

// Global Variables
let city = "";
let searchCity = $("#search-city");
let searchButton = $("#search-button");
let clearButton = $("#clear-history");
let currentCity = $("#current-city");
let currentTemperature = $("#temperature");
let currentHumidty = $("#humidity");
let currentWSpeed = $("#wind-speed");
let currentUvindex = $("#uv-index");
let sCity = [];

// This function will search for what city you type in
function find(c) {
  for (let i = 0; i < sCity.length; i++) {
    if (c.toUpperCase() === sCity[i]) {
      return -1;
    }
  }
  return 1;
}

// Display the curent weather to the user after grabbing the city
function displayWeather(event) {
  event.preventDefault();
  if (searchCity.val().trim() !== "") {
    city = searchCity.val().trim();
    currentWeather(city);
  }
}

function currentWeather(city) {
  // This calls the URL and shows the weather.
  let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    let weathericon = response.weather[0].icon;
    let iconurl =
      "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
    let date = new Date(response.dt * 1000).toLocaleDateString();
    $(currentCity).html(
      response.name + "(" + date + ")" + "<img src=" + iconurl + ">"
    );
    let tempF = (response.main.temp - 273.15) * 1.8 + 32;
    $(currentTemperature).html(tempF.toFixed(2) + "&#8457");
    $(currentHumidty).html(response.main.humidity + "%");
    let ws = response.wind.speed;
    let windsmph = (ws * 2.237).toFixed(1);
    $(currentWSpeed).html(windsmph + "MPH");
  });
}

// This will add the past cities to the local history
function addToList(c) {
  let listEl = $("<li>" + c.toUpperCase() + "</li>");
  $(listEl).attr("class", "list-group-item");
  $(listEl).attr("data-value", c.toUpperCase());
  $(".list-group").append(listEl);
}

// This will then display the past cities in the list format
function invokePastSearch(event) {
  let liEl = event.target;
  if (event.target.matches("li")) {
    city = liEl.textContent.trim();
    currentWeather(city);
  }
}

function loadlastCity() {
  $("ul").empty();
  let sCity = JSON.parse(localStorage.getItem("cityname"));
  if (sCity !== null) {
    sCity = JSON.parse(localStorage.getItem("cityname"));
    for (i = 0; i < sCity.length; i++) {
      addToList(sCity[i]);
    }
    city = sCity[i - 1];
    currentWeather(city);
  }
}

// This is the clear button I added, it will clear the cities from local history and start anew
function clearHistory(event) {
  event.preventDefault();
  sCity = [];
  localStorage.removeItem("cityname");
  document.location.reload();
}

$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);
