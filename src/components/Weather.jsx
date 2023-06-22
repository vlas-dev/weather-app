import React, { useState, useEffect } from "react";

import {
  WiDaySunny,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloudy,
  WiDaySprinkle,
  WiDayRain,
  WiNightAltSprinkle,
  WiNightAltRain,
  WiDayThunderstorm,
  WiNightAltThunderstorm,
  WiDaySnow,
  WiNightAltSnow,
  WiDayFog,
  WiNightFog,
} from "react-icons/wi";
import { LuMoonStar } from "react-icons/lu";
import { BsXLg } from "react-icons/bs";
import { GoSearch, GoLocation } from "react-icons/go";

import { BeatLoader } from "react-spinners";

const Weather = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [loading, setLoading] = useState(false); // New loading state
  const [fetchComplete, setFetchComplete] = useState(false); // New fetchComplete state
  const [userLocation, setUserLocation] = useState(null);
  const [searchKey, setSearchKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");




  
  const fetchUserLocation = async () => {
    try {
      setLoading(true);
      setFetchComplete(false); // Reset fetchComplete state before fetching data

      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      setUserLocation(data);
      setSearchQuery(`${data.city}, ${data.country_code}`); // Set the search query to user's location
      const searchInput = document.querySelector('input[name="search"]');
      if (searchInput) {
        searchInput.value = `${data.city}, ${data.country_code}`; // Set the value of the search input field
      }

      // Fetch weather data with the new search query
      if (data.city && data.country_code) {
        setSearchText(`${data.city}, ${data.country_code}`);
        setSearchKey((prevKey) => prevKey + 1); // Update the searchKey to trigger a new search
      }
    } catch (error) {
      console.error("Error fetching user location:", error);
    } finally {
      setLoading(false);
      setFetchComplete(true); // Set fetchComplete to true after fetching data
    }
  };

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

          // Set the weather condition based on the retrieved data
          setWeatherCondition(metricData.weather[0].icon);
        } else {
          setWeatherData(null);

          setWeatherCondition("");
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
  }, [searchQuery, searchKey]);


  
  useEffect(() => {
    // Update the body class based on the weather condition
    switch (weatherCondition) {
      case "01d":
        document.body.classList.add("bg-clear", "transition-effect");
        break;
      case "01n":
        document.body.classList.add("bg-clear-night", "transition-effect");
        break;
      case "02d":
        document.body.classList.add("bg-cloudy-partial", "transition-effect");
        break;
      case "02n":
        document.body.classList.add(
          "bg-cloudy-partial-night",
          "transition-effect"
        );
        break;
      case "03d":
        document.body.classList.add("bg-cloudy-partial2", "transition-effect");
        break;
      case "03n":
        document.body.classList.add(
          "bg-cloudy-partial2-night",
          "transition-effect"
        );
        break;
      case "04d":
        document.body.classList.add("bg-cloudy", "transition-effect");
        break;
      case "04n":
        document.body.classList.add("bg-cloudy-night", "transition-effect");
        break;
      case "09d":
        document.body.classList.add("bg-drizzle", "transition-effect");
        break;
      case "09n":
        document.body.classList.add("bg-drizzle-night", "transition-effect");
        break;
      case "10d":
        document.body.classList.add("bg-rainy", "transition-effect");
        break;
      case "10n":
        document.body.classList.add("bg-rainy-night", "transition-effect");
        break;
      case "11d":
        document.body.classList.add("bg-thunderstorm", "transition-effect");
        break;
      case "11n":
        document.body.classList.add(
          "bg-thunderstorm-night",
          "transition-effect"
        );
        break;
      case "13d":
        document.body.classList.add("bg-snowy", "transition-effect");
        break;
      case "13n":
        document.body.classList.add("bg-snowy-night", "transition-effect");
        break;
      case "50d":
        document.body.classList.add("bg-foggy", "transition-effect");
        break;
      case "50n":
        document.body.classList.add("bg-foggy-night", "transition-effect");
        break;
      default:
        break;
    }

    return () => {
      // Cleanup the body class when component unmounts
      document.body.classList.remove(
        "bg-clear",
        "bg-clear-night",
        "bg-cloudy-partial",
        "bg-cloudy-partial-night",
        "bg-cloudy-partial2",
        "bg-cloudy-partial2-night",
        "bg-cloudy",
        "bg-cloudy-night",
        "bg-drizzle",
        "bg-drizzle-night",
        "bg-rainy",
        "bg-rainy-night",
        "bg-thunderstorm",
        "bg-thunderstorm-night",
        "bg-snowy",
        "bg-snowy-night",
        "bg-foggy",
        "bg-foggy-night"
      );
    };
  }, [weatherCondition]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = searchText;
    setSearchKey((prevKey) => prevKey + 1); // Update the searchKey

    if (searchValue) {
      setSearchQuery(searchValue);
    } else if (userLocation) {
      fetchUserLocation();
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

  const getWeatherIcon = (weatherIconCode) => {
    switch (weatherIconCode) {
      case "01d":
        return <WiDaySunny />;
      case "01n":
        return <LuMoonStar style={{ width: "45px", height: "70px" }} />;
      case "02d":
      case "03d":
        return <WiDayCloudy />;
      case "02n":
      case "03n":
        return <WiNightAltCloudy />;
      case "04n":
        return <WiCloudy />;
      case "04d":
        return <WiCloudy />;
      case "09d":
        return <WiDaySprinkle />;
      case "09n":
        return <WiNightAltSprinkle />;
      case "10d":
        return <WiDayRain />;

      case "10n":
        return <WiNightAltRain />;
      case "11d":
        return <WiDayThunderstorm />;

      case "11n":
        return <WiNightAltThunderstorm />;
      case "13d":
        return <WiDaySnow />;
      case "13n":
        return <WiNightAltSnow />;
      case "50d":
        return <WiDayFog />;
      case "50n":
        return <WiNightFog />;
      default:
        return null;
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
      minute: "numeric",
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
    setSearchText(city); // Update searchText with the selected city
    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
      searchInput.value = city;
    }
    setSearchKey((prevKey) => prevKey + 1); // Update the searchKey
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div
        className={`w-[330px] md:w-[700px] h-[500px]  bg-white  bg-opacity-10 rounded-xl shadow-lg  backdrop-filter backdrop-blur-sm border border-white border-opacity-20 ${
          weatherCondition.includes("d") ? "text-[#3c3c3c] " : "text-white"
        }`}
      >
        {" "}
        <div className="flex flex-col items-center text-center pt-5 ">
          <div className="text-sm md:text-md md:mb-8 md:mt-2 flex gap-4 md:gap-8">
            <button
              onClick={() => handleShowCityWeather("Buenos Aires, AR")}
              className="hidden md:inline-block focus:outline-none"
            >
              Buenos Aires
            </button>

            <button
              onClick={() => handleShowCityWeather("Miami, US")}
              className="hidden md:inline-block focus:outline-none"
            >
              Miami
            </button>

            <button
              onClick={() => handleShowCityWeather("New York, US")}
              className=" focus:outline-none"
            >
              New York
            </button>

            <button
              onClick={() => handleShowCityWeather("London, GB")}
              className=" focus:outline-none"
            >
              London
            </button>

            <button
              onClick={() => handleShowCityWeather("Paris, FR")}
              className="focus:outline-none"
            >
              Paris
            </button>

            <button
              onClick={() => handleShowCityWeather("Tokyo, JP")}
              className=" focus:outline-none"
            >
              Tokyo
            </button>
          </div>

          <div className="flex">
            <div className="flex items-center mb-4 mt-4 md:mt-0 h-full">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  name="search"
                  placeholder="Enter a city"
                  className={`px-6 py-2 text-lg rounded-l-full border   border-r-0 bg-transparent focus:outline-none w-52 md:w-80 backdrop-blur-sm ${
                    weatherCondition.includes("d") ? "border-[#3c3c3c] placeholder:text-[#7b7b7b] " : "border-white"
                  }`}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoComplete="off"
                  required
                />
                {searchText && (
                  <button
                    type="button"
                    className="absolute right-32 md:right-64"
                    onClick={() => setSearchText("")}
                  >
                    <BsXLg className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-6 py-3 h-full bg-transparent border  rounded-r-full backdrop-blur-sm ${
                    weatherCondition.includes("d") ? "border-[#3c3c3c] " : "border-white"
                  }`}
                >
                  <GoSearch className="w-5 h-5" />
                </button>
              </form>
              <button onClick={fetchUserLocation} className="ml-2 md:ml-4">
                <GoLocation className="w-6 h-6" />
              </button>
            </div>
          </div>

          {loading && !fetchComplete && (
            // Show spinner only when loading is true and fetchComplete is false
            <div className="mt-20">
              <BeatLoader
                color="#ffffff"
                loading={true}
                height={4}
                width={200}
              />
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
                    {getWeatherIcon(weatherData.metric.weather[0].icon)}
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
                      className={` ${
                        unit === "metric" ? "" : "text-[#a3a3a3]"
                      }`}
                    >
                      °C
                    </button>
                    <span className="mb-2 mx-2 font-extralight select-none">
                      |
                    </span>

                    <button
                      onClick={handleUnitChangeImperial}
                      className={` ${
                        unit === "imperial" ? "" : "text-[#a3a3a3]"
                      }`}
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

                  <p>{getLocalTime(weatherData.metric.timezone)}</p>
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
                      ? `${Math.round(weatherData.metric.main.feels_like)} °C`
                      : `${Math.round(
                          weatherData.imperial.main.feels_like
                        )} °F`}
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
                    {unit === "metric"
                      ? `${Math.round(
                          weatherData.metric.wind.speed * 3.6
                        )} km/h`
                      : `${Math.round(weatherData.imperial.wind.speed)} mph`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
