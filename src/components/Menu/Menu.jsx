import "./Menu.scss";

function Menu() {
  return (
    <div className="menu__wrap">
      <svg
        id="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 700"
        width="100%"
        height="100%"
      >
        <rect x="100" y="30" width="380" height="40" fill="#0019A8" />
        <rect x="0" y="360" width="100%" height="200" fill="#e7e7e7" />
        <text className="menu__title menu__title--first" x="110" y="57">
          Set it. Search it. Sorted.
        </text>
        <text className="menu__title" x="100" y="260">
          Route Planner
        </text>
        <text className="menu__title" x="100" y="460">
          Status Updates
        </text>

        <text className="menu__number" x="500" y="270">
          1
        </text>
        <text className="menu__number menu__number--two" x="500" y="470">
          2
        </text>

        <path
          className="theLine"
          d="M 50,50 L 50,201 L 50,451"
          fill="none"
          stroke="#0019A8"
          strokeWidth="17.5"
        />

        <circle
          cx="50"
          cy="50"
          r="30"
          fill="white"
          stroke="black"
          strokeWidth="10"
          className="menu__point1"
        />

        <circle
          className="menu__point2"
          r="30"
          cx="50"
          cy="250"
          fill="white"
          stroke="black"
          strokeWidth="10"
        ></circle>
        <circle
          className="menu__point3"
          r="30"
          cx="50"
          cy="450"
          fill="white"
          stroke="black"
          strokeWidth="10"
        ></circle>
      </svg>
    </div>
  );
}

export default Menu;
