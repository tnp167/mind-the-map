import React from "react";
import "./SubHero.scss";
function SubHero({ headerColor, place }) {
  return (
    <>
      <div className={`sub-hero__banner sub-hero__banner--${headerColor}`}>
        <p className={`sub-hero__place sub-hero__place--${headerColor}  `}>
          {place}
        </p>
      </div>
    </>
  );
}

export default SubHero;
