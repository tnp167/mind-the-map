import { useState, useEffect } from "react";
import "./Table.scss";

function Table({ line, mode }) {
  const [popupActive, setPopupActive] = useState(false);

  const handleMouseOver = () => {
    setPopupActive(true);
  };

  const handleMouseOut = () => {
    setPopupActive(false);
  };

  return (
    <div className="table__container">
      <div className="table__line">
        {mode !== "national-rail" ? (
          <p className={`table__name table__name--${line.id}`}>{line.name}</p>
        ) : (
          <a
            href={line.lineStatuses[0].reason}
            className={`table__name table__name--national-rail`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            {line.name}
          </a>
        )}
        {mode !== "national-rail" ? (
          <p
            className={`table__status ${
              line.lineStatuses[0].statusSeverity === 10
                ? "table__status--good"
                : "table__status--delay"
            }`}
            onMouseOver={
              line.lineStatuses[0].statusSeverity !== 10
                ? handleMouseOver
                : undefined
            }
            onMouseOut={
              line.lineStatuses[0].statusSeverity !== 10
                ? handleMouseOut
                : undefined
            }
          >
            {line.lineStatuses[0].statusSeverityDescription}
          </p>
        ) : (
          <a
            href={line.lineStatuses[0].reason} // External link
            className={`table__status ${
              line.lineStatuses[0].statusSeverity === 10
                ? "table__status--good"
                : "table__status--delay"
            }`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "black" }}
          >
            {line.lineStatuses[0].statusSeverityDescription}
          </a>
        )}
      </div>
      {popupActive && (
        <div className="table__popup">{line.lineStatuses[0].reason}</div>
      )}
    </div>
  );
}

export default Table;
