import React from "react";
import { useRecoilValue } from "recoil";
import { trackColor } from "../Deck/Deck";
import "./SwipeHeader.scss";

export default function SwipeHeader(props) {
  const primaryColors = useRecoilValue(trackColor);
  return (
    <header
      style={{ backgroundColor: primaryColors[0] }}
      className="swipe-header"
    >
      <div className="header-gradient">
        <h1>{props.title}</h1>
      </div>
    </header>
  );
}
