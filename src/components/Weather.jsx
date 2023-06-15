import React, { useState, useEffect } from "react";

import {
  BsSun,
  BsMoon,
  BsClouds,
  BsCloudRain,
  BsCloudLightningRain,
  BsCloudHaze,
  BsSnow,
  BsCloudFog2,
  BsWind,
  BsCloudDrizzle,
 
} from "react-icons/bs";
import { GoSearch } from "react-icons/go";

import { BeatLoader } from "react-spinners";

const Weather = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [loading, setLoading] = useState(false); // New loading state
  const [fetchComplete, setFetchComplete] = useState(false); // New fetchComplete state
  const [userLocation, setUserLocation] = useState(null);


  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserLocation(data);
        setSearchQuery(`${data.city},${data.country_code}`); // Set the search query to user's location
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };
  
    fetchUserLocation();
  }, []);
  
 
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setFetchComplete(false); // Reset fetchComplete state before fetching data

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
      } finally {
        setLoading(false);
        setFetchComplete(true); // Set fetchComplete to true after fetching data
      }
    };

    if (searchQuery) {
      fetchWeatherData();
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.elements.search.value;
    if (searchValue) {
      setSearchQuery(searchValue);
    } else if (userLocation) {
      setSearchQuery(`${userLocation.city},${userLocation.country_code}`);
    }
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

  const getWeatherIcon = (weatherCode, timezoneOffset) => {
    const currentDate = new Date();
    const utcOffset = currentDate.getTimezoneOffset() * 60; // Offset in seconds for UTC time
    const localOffset = timezoneOffset; // Offset in seconds for the searched city
    const localTimeInSeconds =
      currentDate.getTime() / 1000 + utcOffset + localOffset;
    const localDate = new Date(localTimeInSeconds * 1000);

    const currentHour = localDate.getHours();

    const isDaytime = currentHour >= 6 && currentHour < 19; // Assume day from 6 AM to 6 PM

    switch (weatherCode) {
      case "Clouds":
        return <BsClouds />;
      case "Rain":
        return <BsCloudRain />;
      case "Thunderstorm":
        return <BsCloudLightningRain />;
      case "Haze":
        return <BsCloudHaze />;
      case "Snow":
        return <BsSnow />;
      case "Fog":
        return <BsCloudFog2 />;
      case "Drizzle":
        return <BsCloudDrizzle />;
      case "Wind":
        return <BsWind />;
      default:
        return isDaytime ? (
          <BsSun />
        ) : (
          <BsMoon style={{ width: "50px", height: "70px" }} />
        );
    }
  };

  const getLocalTime = (timezoneOffset) => {
    const currentDate = new Date();
    const utcOffset = currentDate.getTimezoneOffset() * 60; // Offset in seconds for UTC time
    const localOffset = timezoneOffset; // Offset in seconds for the searched city
    const localTimeInSeconds =
      currentDate.getTime() / 1000 + utcOffset + localOffset;
    const localDate = new Date(localTimeInSeconds * 1000);

    const weekday = localDate
      .toLocaleDateString([], { weekday: "long" })
      .slice(0, 3);
    const time = localDate.toLocaleTimeString([], {
      hour: "numeric",
      hour12: true,
    });
    const month = localDate
      .toLocaleDateString([], { month: "long" })
      .slice(0, 3);
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

  const handleShowCityWeather = (city) => {
    setSearchQuery(city);
  };

  return (
    <div className="w-[330px] md:w-[700px] h-[500px] mx-auto bg-white bg-opacity-10 rounded-xl shadow-lg mt-16 text-white backdrop-blur-sm">
      <div className="flex flex-col items-center text-center pt-5 ">
      <div className="text-sm md:text-md md:mb-8 md:mt-2 flex gap-4 md:gap-8">
  <button
    onClick={() => handleShowCityWeather("Buenos Aires")}
    className="hidden md:inline-block focus:outline-none"
  >
    Buenos Aires
  </button>


  <button
    onClick={() => handleShowCityWeather("Miami")}
    className="hidden md:inline-block focus:outline-none"
  >
    Miami
  </button>

  <button
    onClick={() => handleShowCityWeather("New York")}
    className=" focus:outline-none"
  >
    New York
  </button>

  <button
    onClick={() => handleShowCityWeather("London")}
    className=" focus:outline-none"
  >
    London
  </button>

  <button
    onClick={() => handleShowCityWeather("Paris")}
    className="focus:outline-none"
  >
    Paris
  </button>

  <button
    onClick={() => handleShowCityWeather("Tokyo")}
    className=" focus:outline-none"
  >
    Tokyo
  </button>
</div>



        <form
          onSubmit={handleSearch}
          className="flex items-center mb-4 mt-4 md:mt-0"
        >
          <input
            type="text"
            name="search"
            placeholder="Enter a city"
            className="px-6 py-2 text-lg rounded-full border border-white bg-transparent focus:outline-none  w-72 md:w-96 backdrop-blur-sm"
            required
          />
          <button type="submit" className="absolute right-10 md:right-44">
            <GoSearch className="w-5 h-5 " />
          </button>
        </form>

        {loading && !fetchComplete && (
          // Show spinner only when loading is true and fetchComplete is false
          <div className="mt-20">
            <BeatLoader color="#ffffff" loading={true} height={4} width={200} />
          </div>
        )}

        {!loading && fetchComplete && searchQuery && !weatherData && (
          // Search query provided, fetch complete, weather data not found, display error message
          <div>
            <p className="mt-20">Location not found.</p>
          </div>
        )}

        {!loading && fetchComplete && weatherData && (
          <div>
            <h2 className="text-3xl  md:text-4xl font-semibold mt-5">
              {weatherData.metric.name}, {weatherData.metric.sys.country}
            </h2>

         

            <div className="flex items-center justify-center mt-8 md:mb-16">
              <div className="flex">
                <div className="text-7xl mx-4">
                  {getWeatherIcon(
                    weatherData.metric.weather[0].main,
                    weatherData.metric.timezone
                  )}
                </div>

                <p className="text-7xl font-bold">
                  {Math.round(
                    unit === "metric"
                      ? weatherData.metric.main.temp
                      : weatherData.imperial.main.temp
                  )}
                </p>

                <div className="pt-1 mx-2 text-2xl">
                  <button
                    onClick={handleUnitChangeMetric}
                    className={` ${unit === "metric" ? "" : "text-gray-700"}`}
                  >
                    °C
                  </button>
                  <span className="mb-2 mx-2 font-extralight select-none">
                    |
                  </span>

                  <button
                    onClick={handleUnitChangeImperial}
                    className={` ${unit === "imperial" ? "" : "text-gray-700"}`}
                  >
                    °F
                  </button>
                </div>
              </div>

              <div className="text-left ml-5 hidden md:block">
                <p className="capitalize">
                  {weatherData.metric.weather[0].description}
                </p>

                {/* Display local time and date */}

                <p>
                  {getLocalTime(weatherData.metric.timezone)}
                    
                </p>

              
              </div>
            </div>


            <div className="block md:hidden mb-8 mt-5">
              <p className="capitalize">
                {weatherData.metric.weather[0].description}
              </p>

              {/* Display local time and date */}

              {getLocalTime(weatherData.metric.timezone)}

            </div>

          <div className="flex justify-between">
              <div className="mx-3 md:mx-5">
  <p className="md:text-lg">Feels like:</p>
  <p className="md:text-xl font-semibold">
    {unit === "metric"
      ? `${Math.round(weatherData.metric.main.feels_like)}${" "}°C`
      : `${Math.round(weatherData.imperial.main.feels_like)}${" "}°F`}
  </p>
</div>
              <div className="mx-3  md:mx-5">
                <p className="md:text-lg">Humidity:</p>
                <p className="md:text-xl font-semibold">
                  {weatherData.metric.main.humidity}%
                </p>
              </div>
              <div className="mx-3  md:mx-5">
                <p className="md:md:text-lg">Wind:</p>
                <p className="md:text-xl font-semibold">
                  {Math.round(
                    unit === "metric"
                      ? weatherData.metric.wind.speed *3.6
                      : weatherData.imperial.wind.speed
                  )}
                  {unit === "metric" ? " km/h" : " mph"}
                </p>
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
