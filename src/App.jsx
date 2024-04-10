import Header from "./components/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { useState, useEffect } from "react";
import RoutePlanner from "./pages/RoutePlanner/RoutePlanner";
import Home from "./pages/Home/Home";
import Status from "./components/Status/Status";
import RouteDetails from "./pages/RouteDetails/RouteDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/route" element={<RoutePlanner />} />
        <Route path="/route-details" element={<RouteDetails />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
