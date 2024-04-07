import "./Hero.scss";
function Hero({ fadeImage }) {
  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "18rem",
    width: "100%",
  };

  return (
    <div>
      <div className="slideshow">
        <div
          style={{
            ...divStyle,
            backgroundImage: `url(${fadeImage})`,
          }}
          className="hero__picture"
        ></div>
      </div>
    </div>
  );
}

export default Hero;
