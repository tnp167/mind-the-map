import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import map from "../../assets/images/tube-medium-zoned.gif";
import Hero from "../../components/Hero/Hero";
import SubHero from "../../components/SubHero/SubHero";
import Table from "../../components/Table/Table";
import axios from "axios";
import "./Status.scss";
import { CircularProgress } from "@mui/material";
import rail from "../../assets/icons/train.svg";
import tube from "../../assets/icons/tube.png";
import railMap from "../../assets/images/rail-map.jpg";
function Status() {
  const [mode, setMode] = useState("tube,overground,dlr,elizabeth-line");
  const [status, setStatus] = useState("");
  const [statusDate, setStatusDate] = useState(new Date());

  const getTubeStatus = async () => {
    try {
      const currentDate = new Date();
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/tfl/status/${mode}`
      );
      setStatus(data);
      setStatusDate(currentDate);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getTubeStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [mode]);

  const handleModeToggle = () => {
    setMode((prevMode) =>
      prevMode === "tube,overground,dlr,elizabeth-line"
        ? "national-rail"
        : "tube,overground,dlr,elizabeth-line"
    );
    console.log("Hi");
  };
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <Hero
        set={
          mode === "national-rail" ? { pictures: railMap } : { pictures: map }
        }
      />
      <SubHero headerColor={"base"} place={mode.replace(/,/g, " - ")} />
      <div className="status__button-container">
        <button
          onClick={handleModeToggle}
          className={`status__button status__button--${
            mode === "national-rail" ? "tube" : "rail"
          }`}
        >
          <img
            src={mode !== "national-rail" ? rail : tube}
            alt={mode !== "national-rail" ? "tube" : "rail"}
            className="status__logo"
          />
          <p>
            {mode !== "national-rail"
              ? "Switch to National Rail"
              : "Switch to Tube, Overground, DLR, and Elizabeth Line"}
          </p>
        </button>
      </div>
      <div className="status__update-container">
        <h3 className="status__update">
          Last updated: {statusDate.toString()}
        </h3>
      </div>
      <div className="status-container">
        {status ? (
          mode.includes("tube") && status[0].modeName === "tube" ? (
            status.map((line) => {
              return <Table key={line.id} line={line} mode={mode} />;
            })
          ) : mode.includes("national-rail") &&
            status[0].modeName === "national-rail" ? (
            status.map((line) => {
              return <Table key={line.id} line={line} mode={mode} />;
            })
          ) : (
            <div className="status__loading">
              <CircularProgress className="status__circular" size="5rem" />
            </div>
          )
        ) : (
          <div className="status__loading">
            <CircularProgress className="status__circular" size="5rem" />
          </div>
        )}
      </div>
    </>
  );
}

export default Status;
