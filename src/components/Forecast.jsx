  /* Add forecast to weather component/ Potential forecast component
            
 <Forecast cityName={weatherData.metric.name} currentDay={getLocalTime(weatherData.metric.timezone).props.children[0]} currentTime={getLocalTime(weatherData.metric.timezone).props.children[2]} currentMonth={getLocalTime(weatherData.metric.timezone).props.children[(4)]} currentDate={getLocalTime(weatherData.metric.timezone).props.children[(6)]} currentYear={getLocalTime(weatherData.metric.timezone).props.children[8]} /> 
          
  


import React, { useEffect, useState } from 'react';

const Forecast = ({ cityName, currentDay, currentTime, currentMonth, currentDate, currentYear }) => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    if (!cityName || !currentDay || !currentTime || !currentMonth || !currentDate || !currentYear) {
      // Don't fetch forecast data if any of the required props are missing
      return;
    }

    // Fetch forecast data using OpenWeatherMap API
    const apiKey = 'e9153ca193b589012defcb2fa87204ed';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Extract the hourly forecast for the current day
        const currentDayForecast = data.list.filter(item => {
          const forecastDate = new Date(item.dt * 1000);
          return forecastDate.getDate() === parseInt(currentDate);
        });

        setForecastData(currentDayForecast.slice(0, 6));
      })
      .catch(error => {
        console.log('Error fetching forecast data:', error);
      });
  }, [cityName, currentDate]);

  if (!cityName || !currentDay || !currentTime || !currentMonth || !currentDate || !currentYear) {
    // Don't render the component if any of the required props are missing
    return null;
  }

  return (
    <div>
      <h2>{currentDay}</h2>
      <ul>
        {forecastData.map(item => (
          <li key={item.dt}>
            <p>{new Date(item.dt * 1000).toLocaleTimeString()}</p>
            <p>{item.main.temp} K</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Forecast;


*/