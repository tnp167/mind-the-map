import { useEffect, useState } from "react";
import axios from "axios";
import "./Options.scss";
import chevron from "../../assets/icons/chevron.png";
import { v4 as uuidv4 } from "uuid";

function Options({ startPoint, endPoint }) {
  const [routes, setRoutes] = useState(null);
  const modeIconMap = {
    walking: require("../../assets/icons/walking.svg").default,
    tube: require("../../assets/icons/tube.png"),
    bus: require("../../assets/icons/bus.png"),
    "elizabeth-line": require("../../assets/icons/elizabeth-line.png"),
    overground: require("../../assets/icons/overground.png"),
    dlr: require("../../assets/icons/dlr.svg").default,
    "national-rail": require("../../assets/icons/train.svg").default,
    "cable-car": require("../../assets/icons/cable-car.png"),
  };

  const getRoute = async () => {
    try {
      const { data } = await axios.get(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${startPoint[1]},${startPoint[0]}/to/${endPoint[1]},${endPoint[0]}`
      );
      setRoutes(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoute();
  }, [startPoint, endPoint]);

  useEffect(() => {
    const timer = setInterval(() => {
      getRoute();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  });

  const durationInHoursAndMinutes = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return (
        <>
          <span>{hours}</span> hr <span>{minutes}</span> min
        </>
      );
    } else {
      return (
        <>
          <span>{minutes}</span> min
        </>
      );
    }
  };

  return (
    <section className="options">
      <h3 className="options__title">Suggested Routes</h3>
      {routes?.journeys?.map((route, index) => (
        <div
          key={uuidv4()}
          className={`options__route ${
            index === routes.journeys.length - 1 ? "options__route--last" : ""
          }`}
        >
          <div className="options__methods">
            {route?.legs.map((leg, index) => (
              <div className="options__details" key={uuidv4()}>
                {index !== 0 && (
                  <img
                    src={chevron}
                    alt="chevron"
                    className="options__chevron"
                  />
                )}
                <img
                  src={modeIconMap[leg.mode.id]}
                  alt={leg.mode.id}
                  className="options__icon"
                />
                {leg.mode.id === "tube" && (
                  <p
                    className={`options__tube options__tube--${leg.routeOptions[0].lineIdentifier.id}`}
                  >
                    {leg.routeOptions[0].name.slice(0, 3)}
                  </p>
                )}
                {leg.mode.id === "bus" && (
                  <p className={`options__bus`}>{leg.routeOptions[0].name}</p>
                )}
                {leg.mode.id === "walking" && (
                  <p className="options__walking">
                    {durationInHoursAndMinutes(leg.duration)}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="options__time">
            {durationInHoursAndMinutes(route.duration)}
          </p>
        </div>
      ))}
    </section>
  );
}

export default Options;
