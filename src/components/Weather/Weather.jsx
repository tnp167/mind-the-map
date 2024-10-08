import axios from "axios";
import { useEffect, useState } from "react";
import "./Weather.scss";
function Weather({ startPoint, endPoint }) {
  const [weather, setWeather] = useState(null);
  const [endWeather, setEndWeather] = useState(null);
  const getWeather = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/weather?lat=${startPoint[1]}&lon=${startPoint[0]}
        `
      );
      setWeather(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getEndWeather = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/weather?lat=${endPoint[1]}&lon=${endPoint[0]}
        `
      );
      setEndWeather(data);
    } catch (error) {
      console.log(error);
    }
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
              className="weather__icon"
            />
            <p className="weather__description weather__description--first">
              {weather.weather[0].description}
            </p>
            <p className="weather__description">{weather.name}</p>
            <p className="weather__temp">
              {Math.round(weather.main.temp - 273)} °C
            </p>
          </div>
          {endWeather.name != weather.name && (
            <div className="weather__container">
              <img
                src={`https://openweathermap.org/img/wn/${endWeather.weather[0].icon}@2x.png`}
                alt="icon"
                className="weather__icon"
              />
              <p className="weather__description weather__description--first">
                {endWeather.weather[0].description}
              </p>
              <p className="weather__description">{endWeather.name}</p>
              <p className="weather__temp">
                {Math.round(endWeather.main.temp - 273)} °C
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Weather;
