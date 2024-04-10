import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Route from "../../components/Route/Route";
import "./RouteDetails.scss";
import axios from "axios";
import { useEffect, useState } from "react";
function RouteDetails() {
  const { state: route } = useLocation();
  const [crowdedDepartureStatuses, setCrowdedDepartureStatuses] = useState([]);
  const [crowdedArrivalStatuses, setCrowdedArrivalStatuses] = useState([]);

  const modeIconMap = {
    walking: require("../../assets/icons/walking.svg").default,
    tube: require("../../assets/icons/tube.png"),
    bus: require("../../assets/icons/bus.png"),
    "elizabeth-line": require("../../assets/icons/elizabeth-line.png"),
    overground: require("../../assets/icons/overground.png"),
    dlr: require("../../assets/icons/dlr.svg").default,
    "national-rail": require("../../assets/icons/train.svg").default,
    "cable-car": require("../../assets/icons/cable-car.png"),
    coach: require("../../assets/icons/coach.png"),
  };

  const convertToAMPM = (timeString) => {
    let date = new Date(timeString);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let period = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return hours + "." + minutes + period;
  };

  const getCrowdedStatus = async (id) => {
    try {
      const { data } = await axios.get(
        `https://api.tfl.gov.uk/crowding/${id}/live`
      );
      return data.percentageOfBaseline <= 0.2
        ? "very quiet"
        : data.percentageOfBaseline <= 0.4
        ? "quite"
        : data.percentageOfBaseline <= 0.6
        ? "moderate"
        : data.percentageOfBaseline <= 0.8
        ? "busy"
        : "very busy";
      return data.percentageOfBaseline;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCrowdedStatus = async () => {
      const departurePromises = route.legs.map((leg) =>
        getCrowdedStatus(leg.departurePoint.naptanId)
      );
      const arrivalPromises = route.legs.map((leg) =>
        getCrowdedStatus(leg.arrivalPoint.naptanId)
      );

      const departureResults = await Promise.all(departurePromises);
      const arrivalResults = await Promise.all(arrivalPromises);

      setCrowdedDepartureStatuses(departureResults);
      setCrowdedArrivalStatuses(arrivalResults);
    };

    fetchCrowdedStatus();
  }, [route]);
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <h2 className="route__time">
        {convertToAMPM(route.startDateTime) +
          " - " +
          convertToAMPM(route.arrivalDateTime)}
      </h2>
      <Route route={route} />
      {route.legs.map((leg, index) => (
        <>
          <div className="route__departure" key={leg.departurePoint.id}>
            <div className="route__departureTime-container">
              <p className="route__departure-time">
                {convertToAMPM(leg.departureTime)}
              </p>
            </div>
            <div className="route__departureName-container">
              <p className="route__departure-name">
                {`${leg.departurePoint.commonName
                  .replace(/ Underground Station/i, "")
                  .replace(/ DLR Station/i, "")}
                 ${
                   leg.departurePoint.stopLetter
                     ? ` (Stop ${leg.departurePoint.stopLetter})`
                     : ""
                 } ${
                  leg.departurePoint.naptanId
                    ? ` (Crowded: ${
                        crowdedDepartureStatuses[index] !== null
                          ? crowdedDepartureStatuses[index]
                          : "Data not available"
                      })`
                    : ""
                } `}
              </p>
            </div>
          </div>
          <div className="route__details">
            <img
              src={modeIconMap[leg.mode.id]}
              alt={leg.mode.id}
              className="route__details-icon"
            />
            <div className="route__details-first">
              <p>
                {leg.routeOptions[0].name}{" "}
                {leg.routeOptions[0].directions.length > 0
                  ? leg.routeOptions[0].directions[0].replace(
                      / Underground Station/i,
                      ""
                    )
                  : "No direction specified"}
              </p>
              <p>
                {leg.duration} mins
                {leg.path.stopPoints.length === 0
                  ? ""
                  : ` (${leg.path.stopPoints.length} Stops)`}
                {leg.distance && leg.distance + " metres"}
              </p>
            </div>
          </div>
          <div className="route__arrivalTime">
            <div className="route__arrivalTime-container">
              <p className="route__arrival-time">
                {convertToAMPM(leg.arrivalTime)}
              </p>
              <p className="route__departure-name">
                {`${leg.arrivalPoint.commonName
                  .replace(/ Underground Station/i, "")
                  .replace(/ DLR Station/i, "")}
                 ${
                   leg.arrivalPoint.stopLetter
                     ? ` (Stop ${leg.arrivalPoint.stopLetter})`
                     : ""
                 } ${
                  leg.arrivalPoint.naptanId
                    ? ` (Crowded: ${
                        crowdedArrivalStatuses[index] !== null
                          ? crowdedArrivalStatuses[index]
                          : "Data not available"
                      })`
                    : ""
                } `}
              </p>
            </div>
          </div>
        </>
      ))}
    </>
  );
}

export default RouteDetails;
