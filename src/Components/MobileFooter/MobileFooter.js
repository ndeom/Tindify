import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { userContext } from "../../UserProvider";
import { cancelAudioContext } from "../../App";
import { ReactComponent as Search } from "../Images/search.svg";
import { ReactComponent as Library } from "../Images/library.svg";
import "./MobileFooter.scss";

export default function MobileFooter() {
  return (
    <nav id="mobile-footer-nav">
      <FooterLink
        text={"Browse"}
        path={"/browse"}
        icon={<Search className="icon" />}
      />
      <FooterLink
        text={"My Tindify"}
        path={"/mytindify"}
        icon={<Library className="icon" />}
      />
    </nav>
  );
}

function FooterLink({ text, path, icon }) {
  const { spotify, userInfo, userToken, previewAudio } = useContext(
    userContext
  );
  const { activeAudio, setActiveAudio } = useContext(cancelAudioContext);
  const location = useLocation();
  const currentPath = location.pathname === path;

  return (
    <Link
      to={{ pathname: path }}
      className={`footer-link ${currentPath ? "active" : ""}`}
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
