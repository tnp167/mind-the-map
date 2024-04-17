import "./Menu.scss";
import { Link } from "react-router-dom";
import point from "../../assets/icons/point.png";
import logo from "../../assets/logos/logo.svg";
import interchange from "../../assets/icons/interchange.png";
function Menu({ headerColor }) {
  function formatDate(date) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  }
  function formatTime(date) {
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    return new Date(date).toLocaleTimeString("en-US", options);
  }

  return (
    <div className="background">
      <div className="menu">
        <div className="menu__title">
          <img src={logo} alt="logo" className="menu__logo" />
          <p className="menu__text">Service information</p>
        </div>
        <p className="menu__date">
          Date <span>{formatDate(new Date())}</span>
        </p>
        <p className="menu__time">
          Time <span>{formatTime(new Date())}</span>
        </p>
        <div className="menu__container">
          <div className="menu__first">
            <img className="menu__point" src={point} alt="point" />
            <p className="menu__detail menu__detail--zero">
              Set it. Search it. Sorted.
            </p>
            <div className={`menu__line line--${headerColor}`}></div>
          </div>
          <div className="menu__second">
            <div className="menu__left">
              <img
                className="menu__interchange"
                src={interchange}
                alt="interchange"
              />
              <p className="menu__detail menu__detail--first">Route Planner</p>
              <Link to="/route" className="menu__link">
                Enter
              </Link>
            </div>
            <p className="menu__zone">1</p>
          </div>

          <div className="menu__outer">
            <div className="menu__third">
              <div className="menu__left">
                <img
                  className="menu__point menu__point--second"
                  src={point}
                  alt="point"
                />
                <p className="menu__detail menu__detail--second">
                  Status Updates
                </p>
                <Link to="/status" className="menu__link">
                  Enter
                </Link>
              </div>
              <div
                className={`menu__line menu__line--second line--${headerColor}`}
              ></div>
              <p className="menu__zone menu__zone--second">2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
