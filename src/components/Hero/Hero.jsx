import { useNavigate } from "react-router-dom";
import "./Hero.scss";
function Hero({ set, index }) {
  const { pictures, coordinates, place, headerColor } = set;
  const navigate = useNavigate();
  return (
    <div>
      <div className="slideshow">
        <div
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            backgroundImage: `url(${pictures})`,
          }}
          className={`hero__picture hero__picture${
            index === 0 ? "--base" : ""
          }`}
          onClick={() => {
            if (index !== 0) {
              navigate(`/route?end=${coordinates}`);
            }
          }}
        >
          <div
            className={`hero__badge hero__badge--${headerColor}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/route?end=${coordinates}`);
            }}
          >
            <p className={`hero__text hero__text--${headerColor}`}>
              Click to navigate to <br />
              {index !== 0 ? `${place}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
