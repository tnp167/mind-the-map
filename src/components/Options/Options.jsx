import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Options.scss";
import { v4 as uuidv4 } from "uuid";
import Route from "../Route/Route";
import { Box, Button, CircularProgress } from "@mui/material";
import { Bookmark } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast, Toaster } from "sonner";

function Options({ startPoint, endPoint, setSelectedRoute }) {
  const { auth } = useContext(AuthContext);
  const [routes, setRoutes] = useState(null);
  const [disabled, setDisabled] = useState(false);
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

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
  };

  const handleSaveRoute = async () => {
    const data = {
      start_point: `${startPoint[1]},${startPoint[0]}`,
      end_point: `${endPoint[1]},${endPoint[0]}`,
      user_id: auth.user.user.id,
    };

    toast.promise(
      axios.post(`${process.env.REACT_APP_API_BASE_URL}/route/bookmark`, data),
      {
        loading: "Saving route...",
        success: () => {
          setDisabled(true);
          return "Route saved successfully!";
        },
        error: "Failed to save route. Please try again.",
      }
    );
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
      <Toaster />
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
      <div className="options__button">
        <Button
          variant="contained"
          size="medium"
          onClick={() => {
            handleSaveRoute();
          }}
          disabled={disabled}
        >
          {" "}
          <span className="options__bookmark">
            <Bookmark />
          </span>
          Save this journey
        </Button>
      </div>
    </section>
  );
}

export default Options;
