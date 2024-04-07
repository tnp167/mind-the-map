import stPaul from "../../assets/images/st-paul.png";
import bigBen from "../../assets/images/big-ben.png";
import towerBridge from "../../assets/images/tower-bridge.png";
import borough from "../../assets/images/borough-market.png";
import piccadilly from "../../assets/images/piccadilly-circus.png";
import buckingham from "../../assets/images/buckingham-palace.png";
import test from "../../assets/images/test.png";
import { useState, useEffect } from "react";
import Header from "../Header/Header";
import "./Hero.scss";
import "react-slideshow-image/dist/styles.css";
function Hero() {
  const pictureSets = [
    {
      pictures: test,
      headerColor: "bakerloo",
      station: "Mind the Map",
    },
    {
      pictures: bigBen,
      headerColor: "circle",
      station: "Westminster",
    },
    {
      pictures: towerBridge,
      headerColor: "district",
      station: "Tower Hill",
    },
    {
      pictures: stPaul,
      headerColor: "central",
      station: "St.Paul",
    },
    {
      pictures: borough,
      headerColor: "northern",
      station: "London Bridge",
    },
    {
      pictures: piccadilly,
      headerColor: "piccadilly",
      station: "Piccadilly Circus",
    },
    {
      pictures: buckingham,
      headerColor: "victoria",
      station: "Green Park",
    },
  ];

  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const { pictures, headerColor, station } = pictureSets[currentSetIndex];

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSetIndex((prevIndex) => (prevIndex + 1) % pictureSets.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Header headerColor={headerColor} station={station} />
      <div className="slideshow">
        <img src={pictures} className="hero__picture" />
      </div>
    </div>
  );
}

export default Hero;
