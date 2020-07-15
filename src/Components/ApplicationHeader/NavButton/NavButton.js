import React from "react";
import { useHistory } from "react-router-dom";
import "./NavButton.scss";

export default function NavButton({ direction }) {
  let history = useHistory();

  return (
    <button
      className={`nav-button ${direction}`}
      onClick={() =>
        direction === "back" ? history.goBack() : history.goForward()
      }
    >
      <svg viewBox="0 0 24 24" className="arrow-svg">
        <path
          fill="currentColor"
          d="M15.54 21.15L5.095 12.23 15.54 3.31l.65.76-9.555 8.16 9.555 8.16"
        ></path>
      </svg>
    </button>
  );
}
