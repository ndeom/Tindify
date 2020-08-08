import React from "react";
import "./Tooltip.scss";

export default function Tooltip({ position, visible, body }) {
  return (
    <div
      className={`tooltip ${visible ? "visible" : ""}`}
      style={{
        left: position.x + "px",
        top: position.y + 16 + "px",
      }}
    >
      <div className="tooltip-arrow"></div>
      <div className="tooltip-body">{`${body}`}</div>
    </div>
  );
}
