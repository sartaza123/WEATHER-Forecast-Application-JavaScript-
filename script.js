const searchBtn = document.querySelector("#search");
let input = document.querySelector("#input");
const tempratureDisplay = document.querySelector(".temprature");

searchBtn.addEventListener("click", () => {
  let isCelsioous = true;

  async function getWeather() {
    const city = input.value.trim();
    if (city === "") {
      console.log("please enter city name");
      return;
    }
    const url = `https://api.weatherapi.com/v1/current.json?key=02193e91dd7b4b849d4104126250211&q=${city}&aqi=yes`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      // searched location ==============================================
      const location = result.location.name;
      const locationCards = document.querySelector(".recent-location-cards");
      locationCards.innerHTML = `
      <div class="locations px-3 py-1 mr-6 flex liquid-glass">
        <div class="location-logo mr-1">
          <ion-icon name="location-outline"></ion-icon>
        </div>
        <div class="location-name">${location}</div>
      </div>`;

      // temprature =====================================================
      const temp_c = parseInt(result.current.temp_c);
      const temp_f = parseInt(result.current.temp_f);
      tempratureDisplay.innerHTML = `
          ${temp_c}<ion-icon name="radio-button-off-outline"
            class="text-xl mb-9 ml-0.5"></ion-icon>C`;

      // weather report =================================================
      const weather = result.current.condition.text;
      const weatherReport = (document.querySelector(
        ".weather-report"
      ).innerHTML = weather);

      // feels like =====================================================
      const feelslike_c = parseInt(result.current.feelslike_c);
      const feelslike_f = parseInt(result.current.feelslike_f);
      const feelsC = document.querySelector(".feels-like");
      feelsC.innerHTML = `Feels Like ${feelslike_c}<ion-icon
        name="radio-button-off-outline"
        class="text-[6px] mb-2"></ion-icon>C`;

      // current weather toggle between Cel & Fe ========================

      const weather_cel_fer = document.querySelector(".current-weather");
      weather_cel_fer.addEventListener("click", () => {
        if (isCelsioous === false) {
          // temprature in Celcious =================
          tempratureDisplay.innerHTML = `
          ${temp_c}<ion-icon name="radio-button-off-outline" class="text-xl mb-9 ml-0.5"></ion-icon>C`;

          // temprature in fahrenhite ================
          feelsC.innerHTML = `Feels Like ${feelslike_c}<ion-icon
          name="radio-button-off-outline"
          class="text-[6px] mb-2"></ion-icon>C`;
        } else {
          // feelsLike in Celcious =================
          tempratureDisplay.innerHTML = `
          ${temp_f}<ion-icon name="radio-button-off-outline"
          class="text-xl mb-9 ml-0.5"></ion-icon>F`;

          // feelsLike in fahrenhite ================
          feelsC.innerHTML = `Feels Like ${feelslike_f}<ion-icon
            name="radio-button-off-outline"
            class="text-[6px] mb-2"></ion-icon>F`;
        }
        isCelsioous = !isCelsioous;
      });

      const humidity = result.current.humidity;
      const wind_kph = result.current.wind_kph;
      const wind_mph = result.current.wind_mph;
      // console.log(result.current);
      input.value = "";
    } catch (error) {
      console.error(error);
    }
  }
  getWeather();
});
input.value = "";

// api key
// 02193e91dd7b4b849d4104126250211
