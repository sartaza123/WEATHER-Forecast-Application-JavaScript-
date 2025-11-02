const search = document.querySelector("#search");

search.addEventListener("click", () => {
  input = document.querySelector("#input").value;
  console.log(input);

  const url = `https://api.weatherapi.com/v1/current.json?key=02193e91dd7b4b849d4104126250211&q=${input}&aqi=yes`;
  const options = {
    method: "GET",
  };
  async function getWeather() {
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  getWeather();
});

// api key
// 02193e91dd7b4b849d4104126250211
