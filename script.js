const searchBtn = document.querySelector("#search");
let input = document.querySelector("#input");
const tempratureDisplay = document.querySelector(".temprature");
const validation = document.querySelector("#validation");

// creating suggestions container =======================================
let suggestionBox = document.createElement("ul");
suggestionBox.id = "city-suggestions";
suggestionBox.className =
  "absolute bg-white opacity-50 shadow-lg rounded-lg mt-10 ml-5 max-h-48 overflow-y-auto z-50 text-gray-800";
input.parentElement.appendChild(suggestionBox);

// ----------------------------------- City Suggestions While Typing...--------------------------------------
input.addEventListener("input", async () => {
  const query = input.value.trim();
  suggestionBox.innerHTML = ""; // clear old suggestions

  if (query.length < 2) return; // wait until 2+ characters

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=02193e91dd7b4b849d4104126250211&q=${query}`
    );
    const data = await response.json();

    // No results
    if (data.length === 0) {
      suggestionBox.innerHTML = `<li class="p-2 text-gray-400">No results found</li>`;
      return;
    }

    // Add suggestions ===================================================
    data.forEach((city) => {
      const li = document.createElement("li");
      li.className = "p-2 hover:bg-gray-100 cursor-pointer";
      li.textContent = `${city.name}, ${city.region}, ${city.country}`;
      li.addEventListener("click", () => {
        input.value = city.name;
        suggestionBox.innerHTML = ""; // hide suggestions
        getWeather(city.name); // fetch weather for selected city
      });
      suggestionBox.appendChild(li);
    });
  } catch (error) {
    console.error("Suggestion fetch error:", error);
  }
});

// ------------------ Search Button Click ------------------
searchBtn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city === "") {
    validation.innerHTML = "Please enter a city name";
    return;
  }
  getWeather(city);
});

// ------------------ Get Weather Function ------------------
async function getWeather(city) {
  let isCelsioous = true;
  const url = `https://api.weatherapi.com/v1/current.json?key=02193e91dd7b4b849d4104126250211&q=${city}&aqi=yes`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    // searched location ==============================================
    const location = result.location.name;
    const locationCards = document.querySelector("#recent-location-cards");
    const locationContainer = document.createElement("div");
    locationContainer.className = "px-3 py-1 mr-6 flex liquid-glass";
    const locationLogo = document.createElement("div");
    locationLogo.innerHTML = `<ion-icon name="location-outline"></ion-icon>`;
    const locationName = document.createElement("div");
    locationName.innerHTML = location;

    locationCards.appendChild(locationContainer);
    locationContainer.append(locationLogo, locationName);

    // temprature =====================================================
    const temp_c = parseInt(result.current.temp_c);
    const temp_f = parseInt(result.current.temp_f);
    tempratureDisplay.innerHTML = `
      ${temp_c}<ion-icon name="radio-button-off-outline"
      class="text-xl mb-9 ml-0.5"></ion-icon>C`;

    // weather report =================================================
    const weather = result.current.condition.text;
    const weatherReport = document.querySelector("#weather-report");
    weatherReport.innerHTML = weather;

    // feels like =====================================================
    const feelslike_c = parseInt(result.current.feelslike_c);
    const feelslike_f = parseInt(result.current.feelslike_f);
    const feelsC = document.querySelector("#feels-like");
    feelsC.innerHTML = `Feels Like ${feelslike_c}<ion-icon
      name="radio-button-off-outline"
      class="text-[6px] mb-2"></ion-icon>C`;

    // current weather toggle between Cel & Fe ========================
    const weather_cel_fer = document.querySelector("#current-weather");
    weather_cel_fer.onclick = () => {
      if (isCelsioous === false) {
        tempratureDisplay.innerHTML = `
        ${temp_c}<ion-icon name="radio-button-off-outline" class="text-xl mb-9 ml-0.5"></ion-icon>C`;
        feelsC.innerHTML = `Feels Like ${feelslike_c}<ion-icon
        name="radio-button-off-outline"
        class="text-[6px] mb-2"></ion-icon>C`;
      } else {
        tempratureDisplay.innerHTML = `
        ${temp_f}<ion-icon name="radio-button-off-outline"
        class="text-xl mb-9 ml-0.5"></ion-icon>F`;
        feelsC.innerHTML = `Feels Like ${feelslike_f}<ion-icon
          name="radio-button-off-outline"
          class="text-[6px] mb-2"></ion-icon>F`;
      }
      isCelsioous = !isCelsioous;
    };

    // humidity and wind =================================================
    const humidity = result.current.humidity;
    const wind_kph = result.current.wind_kph;
    const wind_mph = result.current.wind_mph;

    input.value = "";
    validation.innerHTML = "";
    suggestionBox.innerHTML = "";
  } catch (error) {
    console.error(error);
  }
}

//  current locaton when load =======================================

window.addEventListener("load", async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=02193e91dd7b4b849d4104126250211&q=${lat},${lon}&aqi=yes`;
        const response = await fetch(url);
        const result = await response.json();
        const currentCity = result.location.name;
        getWeather(currentCity);
      } catch (error) {
        console.error("Error loading current location", error);
      }
    });
  }
});
