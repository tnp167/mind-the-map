import React from "react";
import axios from "axios";
function Bike({ route }) {
  const URL = "https://api.tfl.gov.uk/bikepoint";
  let selectedRouteCoordinates = [];
  route.legs.map((leg) => {
    if (leg.mode.id === "walking") {
      const coordinates = JSON.parse(leg.path.lineString);
      const filteredCoordinates = coordinates.filter(
        (_, index) => index % 10 === 0
      );
      selectedRouteCoordinates.push(...filteredCoordinates);
    } else {
      selectedRouteCoordinates.push([
        leg.arrivalPoint.lat,
        leg.arrivalPoint.lon,
      ]);
    }
  });
  const getBikePoint = async () => {
    try {
      const { data } = await axios(URL);
    } catch {}
  };
  return <div></div>;
}

export default Bike;
