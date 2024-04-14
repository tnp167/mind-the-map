import Route from "../Route/Route";
import "./RouteDetails.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import point from "../../assets/icons/point.png";
function RouteDetails({ route }) {
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
    } catch (error) {
      console.log(error);
    }
  };

  const removeStation = (text) =>
    text
      .replace(/ Underground Station/i, "")
      .replace(/ DLR Station/i, "")
      .replace(/ Rail Station/i, "")
      .replace(/ Bus Station/i, "");

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
      <div className="route">
        <h2 className="route__title">
          {convertToAMPM(route.startDateTime) +
            " - " +
            convertToAMPM(route.arrivalDateTime)}
          <span className="route__title-place">
            {"    "}
            <span className="route__title-from">from</span>{" "}
            {removeStation(route.legs[0].departurePoint.commonName)}{" "}
            <span className="route__title-from">to</span>{" "}
            {removeStation(
              route.legs[route.legs.length - 1].arrivalPoint.commonName
            )}
          </span>
        </h2>

        <Route route={route} />
        {route.legs.map((leg, index) => (
          <div className="route__list" key={index}>
            {index === 0 && (
              <div className="route__departure" key={leg.departurePoint.id}>
                <div className="route__departure-first">
                  <p className="route__departure-time">
                    {convertToAMPM(leg.departureTime)}
                  </p>
                </div>
                <img className="route__point" src={point} alt="point" />
                <div className="route__departure-second">
                  <p className="route__departure-name">
                    {`${removeStation(leg.departurePoint.commonName)}
                 ${
                   leg.departurePoint.stopLetter
                     ? ` (Stop ${leg.departurePoint.stopLetter})`
                     : ""
                 }
                ${
                  leg.mode.name === "tube" ||
                  leg.mode.name === "dlr" ||
                  leg.mode.name === "overground" ||
                  leg.mode.name === "elizabeth-line"
                    ? ` (Crowded: ${
                        crowdedDepartureStatuses[index] !== null
                          ? crowdedDepartureStatuses[index]
                          : "Data not available"
                      })`
                    : ""
                } 
                `}
                  </p>
                </div>
              </div>
            )}
            <div className="route__details">
              <div className="route__details-icon">
                <img
                  src={modeIconMap[leg.mode.id]}
                  alt={leg.mode.id}
                  className={`${
                    leg.mode.id === "walking"
                      ? "route__details-icon--img route__details-icon--walking"
                      : "route__details-icon--img"
                  }`}
                />
              </div>
              <div className="route__details-text">
                <div
                  className={`route__line ${
                    leg.mode.name !== "national-rail" &&
                    leg.mode.name !== "bus" &&
                    leg.mode.name !== "coach"
                      ? `route__line--${leg.routeOptions[0].name
                          .toLowerCase()
                          .replace(/[\s&]/g, "-")}`
                      : `route__line--${leg.mode.name}`
                  } ${
                    leg.mode.name === "walking" ? "route__line--walking" : ""
                  }`}
                ></div>
                {leg.mode.name !== "walking" && (
                  <div className="route__details-text route__details-text--top">
                    <p
                      className={`route__color ${
                        leg.mode.name !== "national-rail" &&
                        leg.mode.name !== "bus" &&
                        leg.mode.name !== "coach"
                          ? `route__color--${leg.routeOptions[0].name
                              .toLowerCase()
                              .replace(/[\s&]/g, "-")}`
                          : `route__color--${leg.mode.name}`
                      }`}
                    >
                      {leg.routeOptions[0].name}
                    </p>
                    <p className="route__towards">
                      {leg.routeOptions[0].directions.length > 0
                        ? removeStation(leg.routeOptions[0].directions[0])
                        : ""}
                    </p>
                  </div>
                )}
                <div className="route__details-text route__details-text--bottom">
                  <p>
                    {leg.duration} mins
                    {leg.path.stopPoints.length === 0
                      ? ""
                      : ` (${leg.path.stopPoints.length} Stops)`}{" "}
                    {leg.distance && leg.distance + " metres"}
                  </p>
                </div>
              </div>
            </div>
            <div className="route__arrival">
              <div className="route__arrival-first">
                <p className="route__arrival-time">
                  {convertToAMPM(leg.arrivalTime)}
                </p>
              </div>
              <img className="route__point" src={point} alt="point" />
              <p className="route__arrival-second">
                {removeStation(leg.arrivalPoint.commonName)}{" "}
                {leg.arrivalPoint.stopLetter
                  ? ` (Stop ${leg.arrivalPoint.stopLetter})`
                  : ""}{" "}
                <span style={{ display: "block" }}>
                  {" "}
                  {leg.arrivalPoint.naptanId
                    ? ` (Crowded Status: ${
                        crowdedArrivalStatuses[index] !== null
                          ? crowdedArrivalStatuses[index]
                          : "Data not available"
                      })`
                    : ""}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default RouteDetails;
