import Hero from "../../components/Hero/Hero";
import Menu from "../../components/Menu/Menu";
import stPaul from "../../assets/images/st-paul.png";
import bigBen from "../../assets/images/big-ben.png";
import towerBridge from "../../assets/images/tower-bridge.jpg";
import borough from "../../assets/images/borough-market.jpg";
import piccadilly from "../../assets/images/piccadilly-circus.png";
import buckingham from "../../assets/images/buckingham-palace.png";
import london from "../../assets/images/london.png";
import Header from "../../components/Header/Header";
import "react-slideshow-image/dist/styles.css";
import { Fade } from "react-slideshow-image";
import SubHero from "../../components/SubHero/SubHero";
import "./Home.scss";
import { useEffect, useState } from "react";
import LogoSlider from "../../components/LogoSlider/LogoSlider";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

function Home() {
  const [index, setIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location.state]);

  const pictureSets = [
    {
      pictures: london,
      headerColor: "base",
      station: "Mind the Map",
    },
    {
      pictures: bigBen,
      headerColor: "circle",
      station: "Westminster",
      place: "Palace of Westminster",
      coordinates: "51.499167,-0.124722",
    },
    {
      pictures: towerBridge,
      headerColor: "district",
      station: "Tower Hill",
      place: "Tower Bridge",
      coordinates: "51.5055,-0.075406",
    },
    {
      pictures: stPaul,
      headerColor: "central",
      station: "St.Paul",
      place: "St.paul Cathedral",
      coordinates: "51.5138,-0.0983",
    },
    {
      pictures: borough,
      headerColor: "northern",
      station: "London Bridge",
      place: "Borough Market",
      coordinates: "51.505556,-0.090833",
    },
    {
      pictures: piccadilly,
      headerColor: "piccadilly",
      station: "Piccadilly Circus",
      place: "Piccadilly Circus",
      coordinates: "51.51,-0.134444",
    },
    {
      pictures: buckingham,
      headerColor: "victoria",
      station: "Green Park",
      place: "Buckingham Palace",
      coordinates: "51.500833,-0.141944",
    },
  ];
  const properties = {
    duration: 4000,
    transitionDuration: 1000,
    infinite: true,
    easing: "ease",
  };

  const handleChange = (oldIndex, newIndex) => {
    setIndex(newIndex);
  };
  return (
    <>
      <Fade {...properties} onChange={handleChange}>
        {pictureSets.map((fadeImage, index) => (
          <div key={index}>
            <Header
              headerColor={fadeImage.headerColor}
              station={fadeImage.station}
            />
            <Hero set={fadeImage} index={index} />
            <SubHero
              headerColor={fadeImage.headerColor}
              place={fadeImage.place}
            />
          </div>
        ))}
      </Fade>
      <LogoSlider />
      <Menu headerColor={pictureSets[index].headerColor} />
    </>
  );
}

export default Home;
