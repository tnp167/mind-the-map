import "./Menu.scss";
import { Link } from "react-router-dom";
import point from "../../assets/icons/point.png";
import logo from "../../assets/logos/logo.svg";
function Menu({ headerColor }) {
  function formatDate(date) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  }
  function formatTime(date) {
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    return new Date(date).toLocaleTimeString("en-BG", options);
  }

  return (
    <div className="menu">
      <img src={logo} alt="logo" className="menu__logo" />
      <p className="menu__text">Service Information</p>
      <p className="menu__date">{formatDate(new Date())}</p>
      <p className="menu__time">{formatTime(new Date())}</p>
      <div className="menu__container">
        <div className="menu__first">
          <img className="menu__point" src={point} alt="point" />
          <p className="menu__detail menu__detail--first">
            Set it. Search it. Sorted
          </p>
        </div>
        <div className="menu__second">
          <div className="menu__left">
            <img className="menu__point" src={point} alt="point" />
            <p className="menu__detail">Route Planner</p>
            <Link to="/route" className="menu__link">
              Enter
            </Link>
          </div>
          <div className={`menu__line line--${headerColor}`}></div>
          <p className="menu__zone">1</p>
        </div>

        <div className="menu__outer">
          <div className="menu__third">
            <div className="menu__left">
              <img className="menu__point" src={point} alt="point" />
              <p className="menu__detail">Status Updates</p>
              <Link to="/status" className="menu__link">
                Enter
              </Link>
            </div>
            <p className="menu__zone menu__zone--second">2</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
