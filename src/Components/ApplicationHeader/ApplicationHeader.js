import React, { useState, useContext } from "react";
import { userContext } from "../../UserProvider";
import NavButton from "./NavButton/NavButton";
import ProfileChip from "./ProfileChip/ProfileChip";
import TindifyPlaylist from "../TindifyPlaylist/TindifyPlaylist";
import { useScrollPosition } from "../../utils/useScrollPosition";
import "./ApplicationHeader.scss";

export default function ApplicationHeader() {
  const { userInfo } = useContext(userContext);
  const [displayPlaylist, setDisplayPlaylist] = useState(false);

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
    <div
      id="application-header"
      className={`${headerHasBackground ? "filled" : ""}`}
    >
      <div id="button-container">
        <NavButton direction={"back"} />
        <NavButton direction={"forward"} />
        <NavChip children={"Browse"} />
        <TindifyNavChip setDisplayPlaylist={setDisplayPlaylist}>
          {"My Tindify"}
          {!!displayPlaylist && <TindifyPlaylist />}
        </TindifyNavChip>
      </div>
      <ProfileChip profileInfo={userInfo} />
    </div>
  );
}

function NavChip({ children }) {
  return <button className="nav-chip">{children}</button>;
}

function TindifyNavChip({ children, setDisplayPlaylist }) {
  return (
    <button
      className="nav-chip"
      onClick={() => setDisplayPlaylist(true)}
      onBlur={() => setDisplayPlaylist(false)}
    >
      {children}
    </button>
  );
}
