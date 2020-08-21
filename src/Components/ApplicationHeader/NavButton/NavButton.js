import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { userContext } from "../../../UserProvider";
import { cancelAudioContext } from "../../../App";
import "./NavButton.scss";

export default function NavButton({ direction, testid }) {
  const { previewAudio, userToken, userInfo, spotify } = useContext(
    userContext
  );
  const { activeAudio, setActiveAudio } = useContext(cancelAudioContext);
  let history = useHistory();

  return (
    <button
      className={`nav-button ${direction}`}
      data-testid={testid}
      onClick={() => {
        if (activeAudio) {
          const hasPremium = userInfo.product === "premium";
          if (hasPremium) {
            spotify.setAccessToken(userToken);
            spotify
              .pause()
              .catch((err) =>
                console.error("Error pausing audio on reroute", err)
              );
          } else {
            previewAudio.pause();
          }
          setActiveAudio(false);
        }

        if (direction === "back") {
          history.goBack();
        } else {
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
