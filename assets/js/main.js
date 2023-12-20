"use strict";

const inputCity = document.getElementById("city");
const btnStart = document.querySelector(".weather");
const btnRefresh = document.querySelector(".refresh");
const article = document.querySelector("article");
const weatherIcons = document.querySelector(".weather-icons-container");
const gridWeatherData = document.querySelector(".grid-container");

btnStart.addEventListener("click", getWeatherData);
btnRefresh.addEventListener("click", refreshPage);

async function getWeatherData() {
  article.innerHTML = "";

  // Call the fetch function to request the desired weather data utilizing the current weather data API of open weather
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&units=metric&appid=2fa1662c1af641d6fd162fc1fe68f4f5`
  );
  const data = await response.json();
  const { main, weather, dt, timezone, wind, clouds, sys, coord } = data;

  // Create array with extracted key-value-pairs for the card body
  const weatherDataHeader = [
    { Temperature: `${main.temp.toFixed(1)} °C` },
    // { Icon: createWeatherIcon(weatherIcons) },
    { Description: weather[0].description },
    { "Data obtained": obtainedTime(dt) },
  ];

  const iconUrl = await createWeatherIcon();

  weatherDataHeader.push({ Icon: iconUrl });

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
  createHtmlCard(weatherDataHeader, weatherDataBody, iconUrl);
}

function createHtmlCard(headerData, bodyData, iconUrl) {
  // Display the data header on the html card
  let cityName = inputCity.value;

  const formattedCityName =
    cityName.slice(0, 1).toUpperCase() + cityName.slice(1);

  article.innerHTML = `<h2>${formattedCityName}</h2>`;

  headerData.forEach((data) => {
    if (Object.keys(data)[0] === "Icon") {
      const imgElement = document.createElement("img");
      imgElement.src = iconUrl;
      article.appendChild(imgElement);
    } else {
      article.innerHTML += `<h2>${Object.values(data)[0]}</h2>`;
    }
  });

  // Display the data body inside a grid-container
  bodyData.forEach((data) => {
    gridWeatherData.innerHTML += `<p>${Object.keys(data)[0]}: <br>${
      Object.values(data)[0]
    }</p>`;
  });
}

async function createWeatherIcon() {
  const iconDescript = [
    "clear sky",
    "few clouds",
    "scattered clouds",
    "broken clouds",
    "shower rain",
    "rain",
    "thunderstorm",
    "snow",
    "mist",
  ];

  try {
    const randomDescription =
      iconDescript[Math.floor(Math.random() * iconDescript.length)];

    let iconCode;

    switch (randomDescription) {
      case "clear sky":
        iconCode = "01d";
        break;
      case "few clouds":
        iconCode = "02d";
        break;
      case "scattered clouds":
        iconCode = "03d";
        break;
      case "broken clouds":
        iconCode = "04d";
        break;
      case "shower rain":
        iconCode = "09d";
        break;
      case "rain":
        iconCode = "10d";
        break;
      case "thunderstorm":
        iconCode = "11d";
        break;
      case "snow":
        iconCode = "13d";
        break;
      case "mist":
        iconCode = "50d";
        break;
      default:
        iconCode = "01d";
        break;
    }

    const response = await fetch(
      `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    );
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const iconBlob = await response.blob();

    const iconUrl = URL.createObjectURL(iconBlob);
    console.log(iconUrl);

    const imgElement = document.createElement("img");
    imgElement.src = iconUrl;
    article.appendChild(imgElement);
  } catch (error) {
    console.error("Error fetching weather icon:", error.message);
  }
}

// Function to calculate the obtained time of the data by converting the unix time and convert it into european time format
function obtainedTime(unixTime) {
  const obtain = new Date(unixTime * 1000);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = weekdays[obtain.getDay()];
  const month = (obtain.getMonth() + 1).toString().padStart(2, "0");

  const obtainNew = `Obtained at
    ${obtain
      .getHours()
      .toString()
      .padStart(
        2,
        0
      )}:${obtain.getMinutes()} Uhr <br>${day} ${obtain.getDate()}/${month}/${obtain.getFullYear()}`;
  return obtainNew;
}

// Function to convert the unix time in the european time format
function convertTime(unixTime) {
  const time = new Date(unixTime * 1000);
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Function to use the timezone data of the open weather API to calculate the local time of the desired city
function localeTime(timezone) {
  const timeDiffInHours = timezone / 60 / 60;
  const utcTime = new Date();
  const hours = utcTime.getHours().toString().padStart(2, "0");
  const minutes = utcTime.getUTCMinutes().toString().padStart(2, "0");

  if (hours === "24") {
    return (hours = "0");
  }

  return `${hours}:${minutes} Uhr`;
}

// Function for reloading the webpage
function refreshPage() {
  location.reload();
}
