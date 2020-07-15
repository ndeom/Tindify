import React from "react";
import "./SwipeHeader.scss";

export default function SwipeHeader(props) {
  return (
    <header
      style={{ backgroundColor: props.backgroundColor }}
      className="swipe-header"
    >
      <div className="header-gradient">
        <h1>{props.title}</h1>
      </div>
    </header>
  );
}
