import stPaul from "../../assets/images/st-paul.png";
import bigBen from "../../assets/images/big-ben.png";
import towerBridge from "../../assets/images/tower-bridge.png";
import borough from "../../assets/images/borough-market.png";
import piccadilly from "../../assets/images/piccadilly-circus.png";
import buckingham from "../../assets/images/buckingham-palace.png";
import london from "../../assets/images/london.png";
import { useState, useEffect } from "react";
import { Fade } from "react-slideshow-image";
import Header from "../Header/Header";
import "./Hero.scss";
import "react-slideshow-image/dist/styles.css";
import SubHero from "../SubHero/SubHero";
function Hero() {
  const pictureSets = [
    {
      pictures: london,
      headerColor: "base",
      station: "Mind the Map",
      place: "",
    },
    {
      pictures: bigBen,
      headerColor: "circle",
      station: "Westminster",
      place: "Palace of Westminster",
    },
    {
      pictures: towerBridge,
      headerColor: "district",
      station: "Tower Hill",
      place: "Tower Bridge",
    },
    {
      pictures: stPaul,
      headerColor: "central",
      station: "St.Paul",
      place: "St.paul Cathedral",
    },
    {
      pictures: borough,
      headerColor: "northern",
      station: "London Bridge",
      place: "Borough Market",
    },
    {
      pictures: piccadilly,
      headerColor: "piccadilly",
      station: "Piccadilly Circus",
      place: "Piccadilly Circus",
    },
    {
      pictures: buckingham,
      headerColor: "victoria",
      station: "Green Park",
      place: "Buckingham Palace",
    },
  ];

  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "18rem",
    width: "100%",
  };

  return (
    <div>
      <div className="slideshow">
        <Fade>
          {pictureSets.map((fadeImage, index) => (
            <div key={index}>
              <Header
                headerColor={fadeImage.headerColor}
                station={fadeImage.station}
              />
              <div
                style={{
                  ...divStyle,
                  backgroundImage: `url(${fadeImage.pictures})`,
                }}
                className="hero__picture"
              ></div>
              <SubHero
                headerColor={fadeImage.headerColor}
                place={fadeImage.place}
              />
            </div>
          ))}
        </Fade>
      </div>
    </div>
  );
}

export default Hero;
