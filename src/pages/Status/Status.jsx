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
  const [statusDate, setStatusDate] = useState(new Date());

  const getTubeStatus = async () => {
    try {
      const currentDate = new Date();
      const { data } = await axios.get(
        "https://api.tfl.gov.uk/line/mode/tube,overground,dlr,elizabeth-line/status"
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
  }, []);

  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <Hero fadeImage={map} />
      <SubHero headerColor={"base"} place={"Line Status"} />
      <h3 className="status__update">Last updated: {statusDate.toString()}</h3>
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
