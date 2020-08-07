import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { userContext } from "../../UserProvider";
import { cancelAudioContext } from "../../App";
import NavButton from "./NavButton/NavButton";
import ProfileChip from "./ProfileChip/ProfileChip";
//import TindifyPlaylist from "../../Routes/TindifyPlaylist/TindifyPlaylist";
import { useScrollPosition } from "../../utils/useScrollPosition";
import "./ApplicationHeader.scss";
//import { constSelector } from "recoil";

export default function ApplicationHeader() {
  const { userInfo } = useContext(userContext);
  //const [displayPlaylist, setDisplayPlaylist] = useState(false);

  const [headerHasBackground, setHeaderHasBackground] = useState(false);

  useScrollPosition(
    ({ prevPos, currPos }) => {
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
        <NavChip children={"Browse"} path={"/browse"} />
        <NavChip children={"My Tindify"} path={"/mytindify"} />
        {/*<TindifyNavChip
          displayPlaylist={displayPlaylist}
          setDisplayPlaylist={setDisplayPlaylist}
        >
          {"My Tindify"}
          {!!displayPlaylist && (
            <TindifyPlaylist
              displayPlaylist={displayPlaylist}
              setDisplayPlaylist={setDisplayPlaylist}
            />
          )}
          </TindifyNavChip>*/}
      </nav>
      <ProfileChip profileInfo={userInfo} />
    </header>
  );
}

function NavChip({ children, path }) {
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
      {children}
    </Link>
  );
}

// function TindifyNavChip({ children, displayPlaylist, setDisplayPlaylist }) {
//   return (
//     <button
//       className={`nav-chip ${displayPlaylist ? "active" : ""}`}
//       onClick={() => setDisplayPlaylist(true)}
//       //onBlur={() => setDisplayPlaylist(false)}
//     >
//       {children}
//     </button>
//   );
// }
