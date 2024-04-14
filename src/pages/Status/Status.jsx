import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import map from "../../assets/images/tube-medium-zoned.gif";
import Hero from "../../components/Hero/Hero";
import SubHero from "../../components/SubHero/SubHero";
import Table from "../../components/Table/Table";
import axios from "axios";
import "./Status.scss";
import { CircularProgress } from "@mui/material";
function Status() {
  const [status, setStatus] = useState("");

  const getTubeStatus = async () => {
    try {
      const { data } = await axios.get(
        "https://api.tfl.gov.uk/line/mode/tube,overground,dlr,elizabeth-line/status"
      );
      setStatus(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getTubeStatus();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <Hero fadeImage={map} />
      <SubHero headerColor={"base"} place={"Line Status"} />
      <h3 className="status__update">Last updated: ###</h3>
      <div className="status-container">
        {status ? (
          status.map((line) => {
            return <Table key={line.id} line={line} />;
          })
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
