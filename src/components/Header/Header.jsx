import "./Header.scss";
import logo from "../../assets/logos/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState } from "react";
import user from "../../assets/icons/user.png";

function Header({ headerColor, station }) {
  const { auth, logout } = useContext(AuthContext);
  const [isToggled, setIsToggled] = useState(false);

  const location = useLocation();
  const currentRoute = location.pathname;
  const getNavbarColor = (currentRoute, index) => {
    const routes = [
      { path: "/route", index: 0, select: "--selected" },
      { path: "/status", index: 1, select: "--selected" },
      { path: "/login", index: 2, select: "--selected" },
      { path: "/register", index: 3, select: "--selected" },
    ];

    const matchedRoute = routes.find((route) => {
      return route.path === currentRoute && route.index === index;
    });

    return matchedRoute ? matchedRoute.select : "";
  };

  const toggleMenu = () => {
    setIsToggled(!isToggled);
  };
  return (
    <nav className={`header__container header__container--${headerColor}`}>
      <div className="header__wrap">
        <Link to="/" className="header__logo">
          <img src={logo} alt="logo" className="header__logo" />
          <h2
            className={`header__description header__description--${headerColor}`}
          >
            {station}
          </h2>
        </Link>
        <ul className="header__list">
          <Link
            to="/route"
            className={`header__items header__items--${headerColor} header__items${getNavbarColor(
              currentRoute,
              0
            )}`}
          >
            <li>Route Planner</li>
          </Link>
          <Link
            to="/status"
            className={`header__items header__items--${headerColor} header__items${getNavbarColor(
              currentRoute,
              1
            )}`}
          >
            <li>Status Updates</li>
          </Link>
          {auth.isAuthenticated && (
            <>
              <img
                src={user}
                alt="user"
                className={`header__user header__user--${
                  isToggled ? "open" : ""
                }`}
                onClick={toggleMenu}
              ></img>
              <div
                className={`header__sub-menu-wrap header__sub-menu-wrap--${
                  isToggled ? "open" : ""
                }`}
              >
                <div className="header__sub-menu">
                  <div className="header__info">
                    <img
                      src={user}
                      alt="user"
                      className="header__info-pic"
                    ></img>
                    <p className="header__info-text">
                      {auth.data?.user.firstname} {auth.data?.user.lastname}
                    </p>
                  </div>
                  <div className="header__line"></div>
                  <a href="" className="header__link">
                    <p className="header__link-text">Edit Profile</p>
                    <span className="header__link-arrow">&gt;</span>
                  </a>
                  <a
                    href=""
                    onClick={() => {
                      logout();
                    }}
                    className="header__link"
                  >
                    <p className="header__link-text">Logout</p>
                    <span className="header__link-arrow">&gt;</span>
                  </a>
                </div>
              </div>
            </>
          )}
          {!auth.isAuthenticated && (
            <>
              <Link
                to="/login"
                className={`header__items header__items--${headerColor} header__items${getNavbarColor(
                  currentRoute,
                  2
                )}`}
              >
                <li>Login</li>
              </Link>
              <Link
                to="/register"
                className={`header__items header__items--${headerColor} header__items${getNavbarColor(
                  currentRoute,
                  3
                )}`}
              >
                <li>Register</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
