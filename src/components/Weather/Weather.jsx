import axios from "axios";
import { useEffect, useState } from "react";
import "./Weather.scss";
function Weather({ startPoint, endPoint }) {
  const [weather, setWeather] = useState(null);
  const [endWeather, setEndWeather] = useState(null);
  const openweather_accesstoken =
    process.env.REACT_APP_OPENWEATHER_ACCESS_TOKEN;
  const getWeather = async () => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${startPoint[1]}&lon=${startPoint[0]}&appid=${openweather_accesstoken}
        `
      );
      setWeather(data);
    } catch (error) {}
  };
  const getEndWeather = async () => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${endPoint[1]}&lon=${endPoint[0]}&appid=${openweather_accesstoken}
          `
      );
      setEndWeather(data);
    } catch (error) {}
  };
  useEffect(() => {
    getWeather();
    getEndWeather();
  }, [startPoint, endPoint]);
  console.log(weather);
  console.log(endWeather);
  return (
    <div className="weather__outer">
      {weather && endWeather && (
        <>
          <div className="weather__container">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />
            <p className="weather__description">
              {weather.weather[0].description}
            </p>
            <p className="weather__description">{weather.name}</p>
            <p className="weather__temp">
              {Math.round(weather.main.temp - 273)} Celcius
            </p>
          </div>
          {endWeather.name != weather.name && (
            <div className="weather__container">
              <img
                src={`https://openweathermap.org/img/wn/${endWeather.weather[0].icon}@2x.png`}
                alt="icon"
              />
              <p className="weather__description">
                {endWeather.weather[0].description}
              </p>
              <p className="weather__description">{endWeather.name}</p>
              <p className="weather__temp">
                {Math.round(endWeather.main.temp - 273)} Celcius
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Weather;
