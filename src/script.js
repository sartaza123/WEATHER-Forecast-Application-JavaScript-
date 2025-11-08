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

// ----------------------------------- City Suggestions While Typing --------------------------------------
input.addEventListener("input", async () => {
  const query = input.value.trim();
  suggestionBox.innerHTML = ""; // clear old suggestions

  if (query.length < 2) return; // wait until 2+ characters

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=02193e91dd7b4b849d4104126250211&q=${query}`
    );
    const data = await response.json();

    if (data.length === 0) {
      suggestionBox.innerHTML = `<li class="p-2 text-gray-400">No results found</li>`;
      return;
    }

    data.forEach((city) => {
      const li = document.createElement("li");
      li.className = "p-2 hover:bg-gray-100 cursor-pointer";
      li.textContent = `${city.name}, ${city.region}, ${city.country}`;
      li.addEventListener("click", () => {
        input.value = city.name;
        suggestionBox.innerHTML = "";
        getWeather(city.name);
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

// --------------- Dynamic background------------

function updateBackground(condition, isDay) {
  const dynamicBackground = document.querySelector("#background");
  const weather = condition.toLowerCase();

  let bgImage = "default.jpg"; // fallback

  if (weather.includes("rain")) {
    bgImage = "rain.jpg";
  } else if (weather.includes("cloud")) {
    bgImage = "cloudy.jpg";
  } else if (weather.includes("snow")) {
    bgImage = "snow.jpg";
  } else if (weather.includes("mist") || weather.includes("fog")) {
    bgImage = "mist.jpg";
  } else if (weather.includes("thunder")) {
    bgImage = "thunder.jpg";
  } else if (isDay === 0) {
    bgImage = "night.jpg";
  } else if (weather.includes("sunny") || weather.includes("clear")) {
    bgImage = "sunny.jpg";
  }

  // Apply background image
  const backgroundImg = document.createElement("img");
  backgroundImg.setAttribute("src",`assets/images/${bgImage}`)
  backgroundImg.setAttribute("class","fixed top-0 left-0 w-full h-full object-cover -z-10")  

  dynamicBackground.appendChild(backgroundImg)
  console.log(dynamicBackground)

}

// ------------------ Get Weather Function ------------------
async function getWeather(city) {
  let isCelsioous = true;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=02193e91dd7b4b849d4104126250211&q=${city}&days=5&aqi=no`;

  try {
    const response = await fetch(url);
    const result = await response.json();

     // Update background dynamically
    updateBackground(result.current.condition.text, result.current.is_day);

    // searched location ==============================================
    const location = result.location.name;
    const locationCards = document.querySelector("#recent-location-cards");
    locationCards.innerHTML = `
      <div class="locations px-3 py-1 mr-6 flex liquid-glass">
        <div class="location-logo mr-1">
          <ion-icon name="location-outline"></ion-icon>
        </div>
        <div class="location-name">${location}</div>
      </div>`;

    // temperature =====================================================
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

    // ======================== 5-Day Forecast ========================
    const forecastContainer = document.querySelector("#days");
    forecastContainer.innerHTML = ""; // clear old forecast cards

    const forecastDays = result.forecast.forecastday;
    forecastDays.forEach((day) => {
      const date = day.date;
      const condition = day.day.condition.text;
      const icon = day.day.condition.icon;
      const maxTemp = Math.round(day.day.maxtemp_c);
      const minTemp = Math.round(day.day.mintemp_c);

      const card = document.createElement("div");
      card.className =
        "p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white text-center shadow-md m-2 w-32";
      card.innerHTML = `
        <p class="font-semibold text-sm">${date}</p>
        <img src="${icon}" alt="${condition}" class="mx-auto w-12 h-12">
        <p class="text-sm">${condition}</p>
        <p class="text-lg font-bold">${maxTemp}°C</p>
        <p class="text-xs text-gray-300">Min ${minTemp}°C</p>
      `;
      forecastContainer.appendChild(card);
    });

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

//  current location when load =======================================
window.addEventListener("load", async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=02193e91dd7b4b849d4104126250211&q=${lat},${lon}&aqi=no`;
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
