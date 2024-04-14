import "./Hero.scss";
function Hero({ fadeImage }) {
  return (
    <div>
      <div className="slideshow">
        <div
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            backgroundImage: `url(${fadeImage})`,
          }}
          className="hero__picture"
        ></div>
      </div>
    </div>
  );
}

export default Hero;
