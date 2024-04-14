import { useEffect, useState } from "react";
import axios from "axios";
import "./Options.scss";
import { v4 as uuidv4 } from "uuid";
import Route from "../Route/Route";
import { Box, CircularProgress } from "@mui/material";

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
        <div key={uuidv4()} onClick={() => handleRouteClick(route)}>
          <Route route={route} />
        </div>
      ))}
      {!routes && (
        <Box className="options__loading">
          <CircularProgress />
        </Box>
      )}
    </section>
  );
}

export default Options;
