import "./Menu.scss";
import { Link } from "react-router-dom";

function Menu({ headerColor }) {
  return (
    <div className="menu">
      <div className="menu__container">
        <svg id="svg" viewBox={`0 0 1280 555`} className="menu__svg">
          <rect x="100" y="30" width="380" height="40" fill="#0019A8" />
          <rect x="0" y="360" width="100%" height="200" fill="#e7e7e7" />
          <text className="menu__title menu__title--first" x="110" y="60">
            Set it. Search it. Sorted.
          </text>

          <text className="menu__title" x="100" y="260">
            Route Planner
          </text>

          <text className="menu__title" x="100" y="460">
            Status Updates
          </text>

          <text className="menu__number" x="1200" y="270">
            1
          </text>
          <text className="menu__number menu__number--two" x="1200" y="470">
            2
          </text>

          <path
            className={`line--${headerColor}`}
            d="M 50,50 L 50,201 L 50,450"
            fill="none"
            strokeWidth="17.5"
          />

          <circle
            cx="50"
            cy="50"
            r="25"
            fill="white"
            stroke="black"
            strokeWidth="8"
            className="menu__point1"
          />
          <circle
            className="menu__point2"
            r="25"
            cx="50"
            cy="250"
            fill="white"
            stroke="black"
            strokeWidth="8"
          ></circle>
          <circle
            className="menu__point3"
            r="25"
            cx="50"
            cy="450"
            fill="white"
            stroke="black"
            strokeWidth="8"
          ></circle>
          <g className="menu__button">
            <Link to="/route">
              <rect
                x="350"
                y="230"
                width="150"
                height="40"
                fill="lightgray"
                className="menu__button-background"
              />
              <text
                x="420"
                y="250"
                dominantBaseline="middle"
                textAnchor="middle"
                className="menu__button-text"
              >
                Enter
              </text>
            </Link>
          </g>
          <g className="menu__button menu__button--status">
            <Link to="/status">
              <rect
                x="350"
                y="430"
                width="150"
                height="40"
                fill="lightgray"
                className="menu__button-background"
              />
              <text
                x="420"
                y="450"
                dominantBaseline="middle"
                textAnchor="middle"
                className="menu__button-text"
              >
                Enter
              </text>
            </Link>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Menu;
