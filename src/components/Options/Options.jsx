import { useEffect, useState } from "react";
import axios from "axios";
import "./Options.scss";
import chevron from "../../assets/icons/chevron.png";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import Route from "../Route/Route";

function Options({ startPoint, endPoint, setSelectedRoute }) {
  const [routes, setRoutes] = useState(null);
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

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
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

  return (
    <section className="options">
      <h3 className="options__title">Suggested Routes</h3>
      {routes?.journeys?.map((route, index) => (
        // <Link
        //   key={uuidv4()}
        //   to={{
        //     pathname: "/route-details",
        //   }}
        //   state={route}
        //   style={{ textDecoration: "none", color: "black" }}
        // >
        //   <Route route={route} />
        // </Link>
        <div key={uuidv4()} onClick={() => handleRouteClick(route)}>
          <Route route={route} />
        </div>
      ))}
    </section>
  );
}

export default Options;
