const searchBtn = document.querySelector("#search");
const input = document.querySelector("#input");
const tempratureDisplay = document.querySelector(".temprature");

searchBtn.addEventListener("click", () => {
  async function getWeather() {
    const city = input.value.trim();
    if (city === "") {
      console.log("please inser city name");
      return;
    }
    const url = `https://api.weatherapi.com/v1/current.json?key=02193e91dd7b4b849d4104126250211&q=${city}&aqi=yes`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      // console.log(result);

      const tempC = result.current.temp_c;
      const tempF = result.current.temp_f;
      const location = result.location.name;
      const weather = result.current.condition.text;
      const feelslike_c = result.current.feelslike_c;
      const feelslike_f = result.current.feelslike_f;
      const humidity = result.current.humidity;
      const wind_kph = result.current.wind_kph;
      const wind_mph = result.current.wind_mph;
      console.log(
        tempC,
        tempF,
        location,
        weather,
        feelslike_c,
        feelslike_f,
        humidity,
        wind_kph,
        wind_mph
      );
      console.log(result.current);
    } catch (error) {
      console.error(error);
    }
  }
  getWeather();
});

// api key
// 02193e91dd7b4b849d4104126250211
