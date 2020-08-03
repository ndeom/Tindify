import React from "react";
import "./Loading.scss";

export default function Loading() {
  return (
    <div id="loading-container">
      <div className="dot" id="dot-1"></div>
      <div className="dot" id="dot-2"></div>
      <div className="dot" id="dot-3"></div>
    </div>
  );
}
