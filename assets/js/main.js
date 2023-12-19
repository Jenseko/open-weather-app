"use strict";

const btnStart = document.querySelector(".weather");
const btnRefresh = document.querySelector(".refresh");
const article = document.querySelector("article");
const inputCity = document.getElementById("city");

// Get the button of the html element and add a 'click' event listener to the object

btnStart.addEventListener("click", getWeatherData);

// Button for reloading webpage and add of event listener 'click' to the page

btnRefresh.addEventListener("click", refreshPage);

// Define the function for the API request
async function getWeatherData() {
  article.innerHTML = "";

  // Call the fetch function to request the desired weather data utilizing the current weather data API of open weather
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&units=metric&appid=2fa1662c1af641d6fd162fc1fe68f4f5`
  );
  const data = await response.json();
  // Utilizing object destructuring to filter the desired data from the weather API
  console.log(data);
  const { main, weather, dt, timezone, wind, clouds, sys, coord } = data;

  // Create array with extracted key-value-pairs for the card body
  const weatherDataHeader = [
    { Temperature: `${main.temp.toFixed(1)} °C` },
    { Description: weather[0].description },
    { "Data obtained": obtainedTime(dt) },
  ];

  // Create array with extracted key-value-pairs for the card header
  const weatherDataBody = [
    { "Locale Time": `${localeTime(timezone)}` },
    { "Wind Speed": `${wind.speed} m/s` },
    { Cloudiness: `${clouds.all} %` },
    { Pressure: `${main.pressure} hpa` },
    { Humidity: `${main.humidity} %` },
    { Sunrise: `${convertTime(sys.sunrise)} Uhr` },
    { Sunset: `${convertTime(sys.sunset)} Uhr` },
    {
      Coordinates: `[ ${coord.lon.toFixed(2)} , ${coord.lat.toFixed(2)} ]`,
    },
  ];

  createHtmlCard(weatherDataHeader, weatherDataBody);
}

function createHtmlCard(weatherDataHeader, weatherDataBody) {
  // Display the data header on the html card
  let inputCity = document.getElementById("city").value;

  const formatInputCity =
    inputCity.slice(0, 1).toUpperCase() + inputCity.slice(1);

  article.innerHTML = `<h2>${formatInputCity}</h2>`;

  weatherDataHeader.forEach((data) => {
    article.innerHTML += `<h2>${Object.values(data)[0]}</h2>`;
  });

  // Get the table element to fill it with data
  const weatherDataArt = document.querySelector(".grid-container");
  console.log(weatherDataArt);

  // Display the data body inside a grid-container
  weatherDataBody.forEach((data) => {
    weatherDataArt.innerHTML += `<p>${Object.keys(data)[0]}: <br>${
      Object.values(data)[0]
    }</p>`;
  });
}

// Function to calculate the obtained time of the data by converting the unix time and convert it into european time format
function obtainedTime(unixTime) {
  const obtain = new Date(unixTime * 1000);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = weekdays[obtain.getDay()];
  const month = (obtain.getMonth() + 1).toString().padStart(2, 0);

  const obtainNew = `Obtained at
    ${obtain.getHours()}:${obtain.getMinutes()} Uhr <br>${day}
    ${obtain.getDate()}/${month}/${obtain.getFullYear()}`;
  return obtainNew;
}

// Function to convert the unix time in the european time format
function convertTime(unixTime) {
  const time = new Date(unixTime * 1000);
  const hours = time.getHours().toString().padStart(2, 0);
  const minutes = time.getMinutes().toString().padStart(2, 0);
  const newTime = `${hours}:${minutes}`;
  return newTime;
}

// Function to use the timezone data of the open weather API to calculate the local time of the desired city
function localeTime(timezone) {
  // const timeDiffInHours = timezone / 60 / 60;
  const utcTime = new Date();
  const hours = utcTime.getHours().toString().padStart(2, 0);
  const minutes = utcTime.getUTCMinutes().toString().padStart(2, 0);

  if (hours === "24") {
    return (hours = "0");
  }

  return `${hours}:${minutes} Uhr`;
}

// Function for reloading the webpage
function refreshPage() {
  location.reload();
}
