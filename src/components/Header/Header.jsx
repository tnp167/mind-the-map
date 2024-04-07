import "./Header.scss";
import logo from "../../assets/logos/logo.svg";
import { Link } from "react-router-dom";
function Header({ headerColor, station }) {
  return (
    <nav className={`header__container header__container--${headerColor}`}>
      <div className="header__wrap">
        <Link to="/" className="header__logo">
          <img src={logo} alt="logo" className="header__logo" />
          <h2 className="header__description">{station}</h2>
        </Link>
        <ul className="header__list">
          <Link to="/route" className="header__items">
            <li>Route Planner</li>
          </Link>
          <Link to="/status" className="header__items">
            <li>Status Updates</li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
