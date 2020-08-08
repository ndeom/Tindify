import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { userContext } from "../../UserProvider";
import { cancelAudioContext } from "../../App";
import NavButton from "./NavButton/NavButton";
import ProfileChip from "./ProfileChip/ProfileChip";
import { useScrollPosition } from "../../utils/useScrollPosition";
import { ReactComponent as Search } from "../Images/search.svg";
import { ReactComponent as Library } from "../Images/library.svg";
import "./ApplicationHeader.scss";

export default function ApplicationHeader() {
  const { userInfo } = useContext(userContext);

  const [headerHasBackground, setHeaderHasBackground] = useState(false);

  useScrollPosition(
    ({ currPos }) => {
      const scrolledToTop = currPos.y === 0;
      scrolledToTop
        ? setHeaderHasBackground(false)
        : setHeaderHasBackground(true);
    },
    [headerHasBackground]
  );

  return (
    <header
      id="application-header"
      className={`${headerHasBackground ? "filled" : ""}`}
    >
      <nav id="button-container">
        <NavButton direction={"back"} />
        <NavButton direction={"forward"} />
        <NavChip
          text={"Browse"}
          path={"/browse"}
          icon={<Search className="icon" />}
        />
        <NavChip
          text={"My Tindify"}
          path={"/mytindify"}
          icon={<Library className="icon" />}
        />
      </nav>
      <ProfileChip profileInfo={userInfo} />
    </header>
  );
}

function NavChip({ text, path, icon }) {
  const { spotify, userInfo, userToken, previewAudio } = useContext(
    userContext
  );
  const { activeAudio, setActiveAudio } = useContext(cancelAudioContext);
  const location = useLocation();
  const currentPath = location.pathname === path;

  return (
    <Link
      to={{ pathname: path }}
      className={`nav-chip ${currentPath ? "active" : ""}`}
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
      }}
    >
      {icon}
      {text}
    </Link>
  );
}
