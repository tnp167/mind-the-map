import React from "react";
import Header from "../../components/Header/Header";
import "./NotFound.scss";
import logo from "../../assets/logos/logo.svg";
import { Link } from "react-router-dom";
import { House } from "lucide-react";
function NotFound() {
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <div className="notfound">
        <h1 className="notfound__status">
          <span className="notfound__number--first">4</span>
          <img src={logo} alt="logo" className="notfound__logo" />
          <span className="notfound__number--second">4</span>
        </h1>
        <h2 className="notfound__text">Page not found</h2>
        <h3 className="notfound__text">
          Oops! The page you are looking for does not exist
        </h3>
        <Link className="notfound__link" to="/">
          Back to Home
          <House />
        </Link>
      </div>
    </>
  );
}

export default NotFound;
