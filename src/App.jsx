import React, { useState, useEffect } from "react";
import axios from "axios";
import { WiCloud, WiRain, WiThunderstorm, WiDayHaze, WiSnow, WiFog, WiSprinkle, WiStrongWind, WiDaySunny } from "react-icons/wi";
import { FaSearch } from "react-icons/fa";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isMetric, setIsMetric] = useState(true);

  const weatherAPIKey = "e9153ca193b589012defcb2fa87204ed";

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${isMetric ? "metric" : "imperial"}&appid=${weatherAPIKey}`;

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=Buenos%20Aires&units=metric&appid=${weatherAPIKey}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(weatherURL)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      setLocation("");
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const getWeatherDescription = () => {
    if (data.weather && data.weather.length > 0) {
      const weatherMain = data.weather[0].main;

      switch (weatherMain) {
        case "Clouds":
          return "Cloudy";
        case "Rain":
          return "Rainy";
        case "Haze":
          return "Hazy";
        case "Snow":
          return "Snowy";
        case "Mist":
          return "Misty";
        case "Drizzle":
          return "Drizzly";
        case "Wind":
          return "Windy";
        default:
          return weatherMain;
      }
    }

    return "";
  };

  const getWeatherIcon = () => {
    if (data.weather && data.weather.length > 0) {
      const weatherMain = data.weather[0].main;

      switch (weatherMain) {
        case "Clear":
          return <WiDaySunny size={100} />;
        case "Clouds":
          return <WiCloud size={100} />;
        case "Rain":
          return <WiRain size={100} />;
        case "Thunderstorm":
          return <WiThunderstorm size={100} />;
        case "Haze":
          return <WiDayHaze size={100} />;
        case "Snow":
          return <WiSnow size={100} />;
        case "Mist":
          return <WiFog size={100} />;
        case "Drizzle":
          return <WiSprinkle size={100} />;
        case "Wind":
          return <WiStrongWind size={100} />;
        default:
          return null;
      }
    }

    return null;
  };




  const formatCurrentDayOfWeek = (offset) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
   

    const currentTime = new Date();

    const dayOfWeek = daysOfWeek[currentTime.getUTCDay()];

    return dayOfWeek;
  };






  const formatCurrentDate = (offset) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds() + offset);

    const month = months[currentTime.getUTCMonth()];
    const date = currentTime.getUTCDate();
    const year = currentTime.getUTCFullYear();

    return `${month} ${date}, ${year}`;
  };

  const formatCurrentTime = (offset) => {
    const currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds() + offset);

    const hours = currentTime.getUTCHours();
    const minutes = currentTime.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const toggleUnit = () => {
    setIsMetric((prevIsMetric) => !prevIsMetric);
  };

  useEffect(() => {
    if (data.timezone) {
      const timezoneOffset = data.timezone;
      setCurrentTime(formatCurrentTime(timezoneOffset));
    }
  }, [data]);

  useEffect(() => {
    if (location === "") {
      return;
    }

    const timer = setTimeout(() => {
      axios.get(weatherURL).then((response) => {
        setData(response.data);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [location, weatherURL]);

  return (
    
    <div className="w-[330px] md:w-[700px] h-[500px] mx-auto bg-white bg-opacity-10 rounded-xl shadow-lg mt-16 text-white backdrop-blur-sm">
      
      <div className="text-center pt-8">

        <div className="flex items-center justify-center">
          <input
            value={location}
            onChange={handleLocationChange}
            onKeyDown={searchLocation}
            placeholder="Search"
            type="text"
            className="px-6 py-2 text-lg rounded-full border border-white bg-transparent focus:outline-none placeholder:text-white w-72 md:w-96 backdrop-blur-sm"
          />
          <button
            className="absolute right-10 md:right-44 top-11"
            onClick={searchLocation}
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="max-w-3xl h-3/5 mx-auto mt-5  flex flex-col justify-between">
        <div className="top mx-auto my-4 flex flex-col items-center">
          <div className=" pr-4">
            <p className="text-3xl mb-5">
              {data.name}, {data.sys && data.sys.country}
            </p>
          </div>
          <div className="temp flex items-center">
            {data.main ? (
              <>
                <div>
                  {getWeatherIcon()}
                </div>
                <div className="flex items-center">
                  <h1 className="text-7xl font-bold">
                    {isMetric
                      ? data.main.temp.toFixed()
                      : ((data.main.temp * 9) / 5 + 32).toFixed()}
                  </h1>
                  <div className="flex items-center ml-2 mb-7">
                    <button
                      onClick={toggleUnit}
                      className={`focus:outline-none ${
                        isMetric
                          ? " text-white"
                          : "bg-transparent text-gray-700"
                      }`}
                      disabled={isMetric} // Disable if already in metric units
                      style={{ marginTop: "-0.5rem" }}
                    >
                      °C
                    </button>
                    <span className="mb-2 mx-2 text-white">|</span>
                    <button
                      onClick={toggleUnit}
                      className={`focus:outline-none ${
                        isMetric
                          ? "bg-transparent text-gray-700"
                          : " text-white"
                      }`}
                      disabled={!isMetric} // Disable if already in imperial units
                      style={{ marginTop: "-0.5rem" }}
                    >
                      °F
                    </button>
                  </div>

                        <div>

                

                  <div className=" ml-7">
              {currentTime && (
                <>
                 <div className="hidden md:block text-xl font-semibold">Weather</div>
               
                <div className="hidden md:block">  {data.weather ? <p>{getWeatherDescription()}</p> : null}
                <p>{formatCurrentDayOfWeek(data.timezone)} {formatCurrentTime(data.timezone)}</p>

                <p>{formatCurrentDate(data.timezone)}</p>

                
                </div>

                </>
              )}
            </div>

            </div>

                </div>
                
              </>
            ) : null}
          </div>

          <div className="md:hidden mt-4">
          <p>{formatCurrentDayOfWeek(data.timezone)} {formatCurrentTime(data.timezone)}</p>

          <p>{formatCurrentDate(data.timezone)}</p>

          </div>
        </div>

        {data.name !== undefined && (
          <div className="mx-auto p-4">
            <div className="feels">
              {data.main ? (
                <>
                  <p>
                    Feels Like:{" "}
                    {isMetric
                      ? data.main.feels_like.toFixed()
                      : ((data.main.feels_like * 9) / 5 + 32).toFixed()}{" "}
                    {isMetric ? "°C" : "°F"}
                  </p>
                </>
              ) : null}
            </div>
            <div className="humidity">
              {data.main ? (
                <>
                  <p>Humidity: {data.main.humidity}%</p>
                </>
              ) : null}
            </div>
            <div className="wind">
              {data.wind ? (
                <>
                  <p>
                    Wind: {(data.wind.speed * (isMetric ? 3.6 : 1)).toFixed()}{" "}
                    {isMetric ? "km/h" : "mph"}
                  </p>
                </>
              ) : null}
            </div>
           
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
