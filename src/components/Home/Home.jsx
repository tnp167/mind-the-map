import Hero from "../Hero/Hero";
import Menu from "../Menu/Menu";
import stPaul from "../../assets/images/st-paul.png";
import bigBen from "../../assets/images/big-ben.png";
import towerBridge from "../../assets/images/tower-bridge.png";
import borough from "../../assets/images/borough-market.png";
import piccadilly from "../../assets/images/piccadilly-circus.png";
import buckingham from "../../assets/images/buckingham-palace.png";
import london from "../../assets/images/london.png";
import Header from "../Header/Header";
import "react-slideshow-image/dist/styles.css";
import { Slide, Fade } from "react-slideshow-image";
import SubHero from "../SubHero/SubHero";
import { useEffect, useState } from "react";
import "./Home.scss";
function Home() {
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
  const properties = {
    duration: 3000,
    transitionDuration: 1000,
    infinite: true,
    easing: "ease",
  };

  return (
    <>
      <Fade {...properties}>
        {pictureSets.map((fadeImage, index) => (
          <div key={index}>
            <Header
              headerColor={fadeImage.headerColor}
              station={fadeImage.station}
            />
            <Hero fadeImage={fadeImage.pictures} />
            <SubHero
              headerColor={fadeImage.headerColor}
              place={fadeImage.place}
            />
            <Menu headerColor={fadeImage.headerColor} />
          </div>
        ))}
      </Fade>
    </>
  );
}

export default Home;
