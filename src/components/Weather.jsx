import React, { useState, useEffect } from "react";
import {
  WiCloud,
  WiRain,
  WiThunderstorm,
  WiDayHaze,
  WiSnow,
  WiFog,
  WiSprinkle,
  WiStrongWind,
  WiDaySunny,
} from "react-icons/wi";
import { FiSearch } from "react-icons/fi";

const Weather = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = "e9153ca193b589012defcb2fa87204ed";
        const metricUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=${apiKey}`;
        const imperialUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=imperial&appid=${apiKey}`;

        const [metricResponse, imperialResponse] = await Promise.all([
          fetch(metricUrl),
          fetch(imperialUrl),
        ]);

        const metricData = await metricResponse.json();
        const imperialData = await imperialResponse.json();

        if (metricResponse.ok && imperialResponse.ok) {
          setWeatherData({ metric: metricData, imperial: imperialData });
        } else {
          setWeatherData(null);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (searchQuery) {
      fetchWeatherData();
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.elements.search.value);
  };

  const handleUnitChangeMetric = () => {
    if (unit !== "metric") {
      setUnit("metric");
    }
  };

  const handleUnitChangeImperial = () => {
    if (unit !== "imperial") {
      setUnit("imperial");
    }
  };

  const getWeatherIcon = (weatherCode) => {
    switch (weatherCode) {
      case "Clouds":
        return <WiCloud />;
      case "Rain":
        return <WiRain />;
      case "Thunderstorm":
        return <WiThunderstorm />;
      case "Haze":
        return <WiDayHaze />;
      case "Snow":
        return <WiSnow />;
      case "Fog":
        return <WiFog />;
      case "Drizzle":
        return <WiSprinkle />;
      case "Wind":
        return <WiStrongWind />;
      default:
        return <WiDaySunny />;
    }
  };

  const getLocalTime = (timezoneOffset) => {
    const currentDate = new Date();
    const utcOffset = currentDate.getTimezoneOffset() * 60; // Offset in seconds for UTC time
    const localOffset = timezoneOffset; // Offset in seconds for the searched city
    const localTimeInSeconds =
      currentDate.getTime() / 1000 + utcOffset + localOffset;
    const localDate = new Date(localTimeInSeconds * 1000);

    const weekday = localDate.toLocaleDateString([], { weekday: "long" });
    const time = localDate.toLocaleTimeString([], {
      hour: "numeric",
      hour12: true,
    });
    const month = localDate.toLocaleDateString([], { month: "long" });
    const day = localDate.toLocaleDateString([], { day: "numeric" });
    const year = localDate.toLocaleDateString([], { year: "numeric" });

    return (
      <div>
        {weekday}, {time}
        <br />
        {month} {day}, {year}
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          name="search"
          placeholder="Enter a city"
          className="p-2 rounded-l-full focus:outline-none"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 rounded-r-full hover:bg-blue-600 focus:outline-none"
        >
           <FiSearch className="w-5 h-5 " />
        </button>
      </form>
      {weatherData && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {weatherData.metric.name}, {weatherData.metric.sys.country}
          </h2>
          <div className="flex items-center mb-4">
            <div className="mr-2">
              {getWeatherIcon(weatherData.metric.weather[0].main)}
            </div>
            <div>
              <p className="text-2xl">
                {Math.round(
                  unit === "metric"
                    ? weatherData.metric.main.temp
                    : weatherData.imperial.main.temp
                )}
              </p>
              <p>Humidity: {weatherData.metric.main.humidity}%</p>
              <p>
                Wind:{" "}
                {unit === "metric"
                  ? (weatherData.metric.wind.speed * 3.6).toFixed()
                  : weatherData.imperial.wind.speed.toFixed()}{" "}
                {unit === "metric" ? "km/h" : "mph"}
              </p>
              <p>{weatherData.metric.weather[0].description}</p>
              <p>{getLocalTime(weatherData.metric.timezone)}</p>{" "}
              {/* Display local time */}
            </div>
          </div>

          <div className="">
            <button
              onClick={handleUnitChangeMetric}
              className={` ${unit === "metric" ? "text-blue-500" : ""}`}
            >
              °C
            </button>
            <span className="mb-2 mx-2 font-extralight select-none">|</span>

            <button
              onClick={handleUnitChangeImperial}
              className={` ${unit === "imperial" ? "text-blue-500" : ""}`}
            >
              °F
            </button>
          </div>



        </div>
      )}
    </div>
  );
};

export default Weather;
