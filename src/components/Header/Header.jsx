import "./Header.scss";
import logo from "../../assets/logos/logo.svg";
import { Link, useLocation } from "react-router-dom";

function Header({ headerColor, station }) {
  const location = useLocation();
  const currentRoute = location.pathname;
  const getNavbarColor = (currentRoute, index) => {
    const routes = [
      { path: "/route", index: 0, select: "--selected" },
      { path: "/status", index: 1, select: "--selected" },
    ];

    const matchedRoute = routes.find((route) => {
      return route.path === currentRoute && route.index === index;
    });

    return matchedRoute ? matchedRoute.select : "";
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
        </ul>
      </div>
    </nav>
  );
}

export default Header;
