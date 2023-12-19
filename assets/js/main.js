// Get the button of the html element and add a 'click' event listener to the object
const buttonStart = document.querySelector(".weather");
buttonStart.addEventListener("click", getWeatherData);

// Button for reloading webpage and add of event listener 'click' to the page
const buttonRefresh = document.querySelector(".refresh");
buttonRefresh.addEventListener("click", refreshPage);

// Define the function for the API request
function getWeatherData() {
  // Get article element for check of text content
  const article = document.querySelector("article");
  const textContentArticle = article.textContent;

  // Check if text content of article is empty. If not do not execute the function
  if (textContentArticle === "") {
    // Get the city the weather forecast is desired to give it the API
    const inputCity = document.getElementById("city");
    // Define an array for the weather data and further editing
    const weatherDataArr = [];

    // Call the fetch function to request the desired weather data utilizing the current weather data API of open weather
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&units=metric&appid=2fa1662c1af641d6fd162fc1fe68f4f5`
    )
      .then((response) => response.json())
      .then((data) => {
        // Utilizing object destructuring to filter the desired data from the weather API
        const { main, weather, dt, timezone, wind, clouds, sys, coord } = data;

        // Create array with extracted key-value-pairs for the card body
        const weatherDataHeader = [
          { Temperature: main.temp.toFixed(1) + "°C" },
          { Description: weather[0].description },
          { "Data obtained": obtainedTime(dt) },
        ];

        // Create array with extracted key-value-pairs for the card header
        const weatherDataBody = [
          { "Locale Time": localeTime(timezone) },
          { "Wind Speed": wind.speed + " m/s" },
          { Cloudiness: clouds.all + " %" },
          { Pressure: main.pressure + " hpa" },
          { Humidity: main.humidity + " %" },
          { Sunrise: convertTime(sys.sunrise) + " Uhr" },
          { Sunset: convertTime(sys.sunset) + " Uhr" },
          {
            Coordinates:
              "[" + coord.lon.toFixed(2) + ", " + coord.lat.toFixed(2) + "]",
          },
        ];

        createHtmlCard(weatherDataHeader, weatherDataBody);
      });
  }
}

function createHtmlCard(weatherDataHeader, weatherDataBody) {
  // Get the article element to append the h2 elements by using innerHTML
  const article = document.querySelector("article");

  // Display the data header on the html card

  inputCity = document.getElementById("city").value;

  const formatInputCity =
    inputCity.slice(0, 1).toUpperCase() + inputCity.slice(1);

  article.innerHTML = `<h2>${formatInputCity}</h2>`;

  weatherDataHeader.forEach((data) => {
    article.innerHTML += `<h2>${Object.values(data)[0]}</h2>`;
  });

  // Get the table element to fill it with data
  const tableData = document.querySelector("table");
  // console.log(tableData);

  // Display the data body inside a table element
  weatherDataBody.forEach((data) => {
    tableData.innerHTML += `<p>${Object.keys(data)[0]}</td><p>${
      Object.values(data)[0]
    }</p>`;
  });
}

// Function to calculate the obtained time of the data by converting the unix time and convert it into european time format
function obtainedTime(unixTime) {
  const obtain = new Date(unixTime * 1000);
  const obtainNew =
    "Obtained at " +
    obtain.getHours() +
    ":" +
    obtain.getMinutes() +
    " Uhr, " +
    obtain.getDate() +
    "." +
    (obtain.getMonth() + 1) +
    "." +
    obtain.getFullYear();
  return obtainNew;
}

// Function to convert the unix time in the european time format
function convertTime(unixTime) {
  const time = new Date(unixTime * 1000);
  const newTime = time.getHours() + ":" + time.getMinutes();
  return newTime;
}

// Function to use the timezone data of the open weather API to calculate the local time of the desired city
function localeTime(timezone) {
  const timeDiffInHours = timezone / 60 / 60;
  const utcTime = new Date();
  return (
    utcTime.getUTCHours() +
    timeDiffInHours +
    ":" +
    utcTime.getUTCMinutes() +
    " Uhr"
  );
}

// Function for reloading the webpage
function refreshPage() {
  location.reload();
}
