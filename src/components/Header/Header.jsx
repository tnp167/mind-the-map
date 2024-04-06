import "./Header.scss";
import logo from "../../assets/logos/logo.svg";
import { Link } from "react-router-dom";
function Header() {
  return (
    <nav className="header__container">
      <div className="header__logo">
        <Link to="/">
          <img src={logo} alt="logo" className="header__logo" />
        </Link>
        <h2 className="header__description">Mind the Map</h2>
      </div>
    </nav>
  );
}

export default Header;
