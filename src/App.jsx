import Header from "./components/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { useState, useEffect } from "react";
import RoutePlanner from "./components/RoutePlanner/RoutePlanner";
import Home from "./components/Home/Home";
import Status from "./components/Status/Status";
function App() {
  const [headerColor, setHeaderColor] = useState("initialColor");

  const changeHeaderColorBasedOnHeroImage = (heroImage) => {
    let color = "initialColor";

    if (heroImage === "bright") {
      color = "lightColor";
    } else if (heroImage === "dark") {
      color = "darkColor";
    }

    setHeaderColor(color);
  };

  useEffect(() => {
    const heroImage = "bright";
    changeHeaderColorBasedOnHeroImage(heroImage);
  }, []);
  return (
    <BrowserRouter>
      <Header headerColor={headerColor} />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/route" element={<RoutePlanner />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
