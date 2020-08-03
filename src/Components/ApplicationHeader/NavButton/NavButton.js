import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { cancelAudioContext } from "../../../App";
import "./NavButton.scss";

export default function NavButton({ direction }) {
  const { setCancelAudio, activeAudio } = useContext(cancelAudioContext);
  let history = useHistory();

  return (
    <button
      className={`nav-button ${direction}`}
      onClick={() => {
        //Triggers global context to cancel any audio playing
        //and then directs to previous route
        if (direction === "back") {
          if (activeAudio) setCancelAudio(true);
          history.goBack();
        } else {
          if (activeAudio) setCancelAudio(true);
          history.goForward();
        }
      }}
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
