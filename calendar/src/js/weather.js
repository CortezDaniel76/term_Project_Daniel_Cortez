// Daniel Cortez-Sanchez 6/6/24
document.addEventListener("DOMContentLoaded", () => {
    const geoUrl = "https://api.openweathermap.org/geo/1.0/zip?";
    const weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&";
    const weatherApiKey = "insert your own key i could not get .env to work";
    const defaultZipcode = "97401";
  
    function updateWeather(zipcode) {
      fetch(`${geoUrl}zip=${zipcode},US&appid=${weatherApiKey}`)
        .then(response => response.json())
        .then(geoData => {
          const lat = geoData.lat;
          const lon = geoData.lon;
          const city = geoData.name;
          document.getElementById('city-name').innerText = city;
          return fetch(`${weatherUrl}lat=${lat}&lon=${lon}&appid=${weatherApiKey}`);
        })
        .then(response => response.json())
        .then(weatherData => {
          const forecastElements = document.querySelectorAll('.calendar-footer p');
          const dailyForecasts = {};
  
          const currentDate = new Date();
          
          weatherData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateString = date.toISOString().split('T')[0];
  
            //Check if the date is next three days for weather
            if (date >= currentDate && date <= new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000)) {
              if (!dailyForecasts[dateString]) {
                dailyForecasts[dateString] = {
                  high: item.main.temp_max,
                  low: item.main.temp_min,
                  description: item.weather[0].description,
                  sunrise: new Date(weatherData.city.sunrise * 1000).toLocaleTimeString('en-US', { timeStyle: 'short' }),
                  sunset: new Date(weatherData.city.sunset * 1000).toLocaleTimeString('en-US', { timeStyle: 'short' }),
                };
              } else {
                dailyForecasts[dateString].high = Math.max(dailyForecasts[dateString].high, item.main.temp_max);
                dailyForecasts[dateString].low = Math.min(dailyForecasts[dateString].low, item.main.temp_min);
              }
            }
          });
  
          //Display forecasts for the next three days
          forecastElements.forEach((element, index) => {
            const date = new Date(currentDate.getTime() + (index + 1) * 24 * 60 * 60 * 1000);
            const dateString = date.toISOString().split('T')[0];
            const forecast = dailyForecasts[dateString];
            if (forecast) {
              const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              const day = new Intl.DateTimeFormat('en-US', options).format(date);
              element.innerText = `${day}: ${forecast.description}, High: ${forecast.high}°F, Low: ${forecast.low}°F (Sunrise: ${forecast.sunrise}, Sunset: ${forecast.sunset})`;
            }
          });
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          document.getElementById('error-message').innerText = "Failed to fetch weather data. Please try again later.";
        });
    }
  
    document.querySelector('.search-bar button').addEventListener('click', () => {
      const zipcode = document.querySelector('.search-bar input').value.trim(); // remove whitespace
      if (zipcode) {
        updateWeather(zipcode);
      } else {
        alert("Please enter a zipcode.");
      }
    });
  
    updateWeather(defaultZipcode); //Load default Eugene OR
  });
  