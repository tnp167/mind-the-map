import { useEffect, useState } from "react";
import axios from "axios";
import "./Options.scss";
function Options({ startPoint, endPoint }) {
  const [routes, setRoutes] = useState(null);
  const modeIconMap = {
    walking: require("../../assets/icons/walking.svg").default,
    tube: require("../../assets/icons/tube.png"),
    bus: require("../../assets/icons/bus.png"),
  };

  const getRoute = async () => {
    try {
      const { data } = await axios.get(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${startPoint[1]},${startPoint[0]}/to/${endPoint[1]},${endPoint[0]}`
      );
      setRoutes(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRoute();
  }, [startPoint, endPoint]);

  return (
    <>
      {routes?.journeys?.map((route) => (
        <div className="options__route" key={route.id}>
          {route?.legs.map((leg) => (
            <div className="options__method">
              <div className="options__details">
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
              </div>
              <h3>{leg.duration}</h3>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default Options;
