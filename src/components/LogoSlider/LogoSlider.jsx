import bus from "../../assets/slider/Buses_roundel.png";
import cable from "../../assets/slider/Cable_Car_roundel.png";
import dlr from "../../assets/slider/DLR_roundel.png";
import elizabeth from "../../assets/slider/Elizabeth_line_roundel.png";
import overground from "../../assets/slider/London_Overground_logo.svg.png";
import trams from "../../assets/slider/Trams_roundel.png";
import underground from "../../assets/slider/Underground_roundel.png";
import bakerloo from "../../assets/slider/Bakerloo.png";
import central from "../../assets/slider/Central.png";
import circle from "../../assets/slider/Circle.png";
import district from "../../assets/slider/District.png";
import H_C from "../../assets/slider/H&C.png";
import jubilee from "../../assets/slider/Jubilee.png";
import met from "../../assets/slider/Metropolitan.png";
import northern from "../../assets/slider/Northern.png";
import picadilly from "../../assets/slider/Picadilly.png";
import victoria from "../../assets/slider/Victoria.png";
import waterloo from "../../assets/slider/Waterloo.png";

import "./LogoSlider.scss";
function LogoSlider() {
  return (
    <div className="logos">
      <div className="logos__slider">
        <img src={bus} alt="bus" />
        <img src={cable} alt="cable" />
        <img src={dlr} alt="dlr" />
        <img src={elizabeth} alt="elizabeth" />
        <img src={overground} alt="overground" />
        <img src={trams} alt="trams" />
        <img src={underground} alt="underground" />
        <img src={bakerloo} alt="bakerloo" />
        <img src={central} alt="central" />
        <img src={circle} alt="circle" />
        <img src={district} alt="district" />
        <img src={H_C} alt="h&c" />
        <img src={jubilee} alt="jubilee" />
        <img src={met} alt="metropolitan" />
        <img src={northern} alt="northern" />
        <img src={picadilly} alt="picadilly" />
        <img src={victoria} alt="victoria" />
        <img src={waterloo} alt="waterloo" />
      </div>
      <div className="logos__slider">
        <img src={bus} alt="bus" />
        <img src={cable} alt="cable" />
        <img src={dlr} alt="dlr" />
        <img src={elizabeth} alt="elizabeth" />
        <img src={overground} alt="overground" />
        <img src={trams} alt="trams" />
        <img src={underground} alt="underground" />
        <img src={bakerloo} alt="bakerloo" />
        <img src={central} alt="central" />
        <img src={circle} alt="circle" />
        <img src={district} alt="district" />
        <img src={H_C} alt="h&c" />
        <img src={jubilee} alt="jubilee" />
        <img src={met} alt="metropolitan" />
        <img src={northern} alt="northern" />
        <img src={picadilly} alt="picadilly" />
        <img src={victoria} alt="victoria" />
        <img src={waterloo} alt="waterloo" />
      </div>
    </div>
  );
}

export default LogoSlider;
