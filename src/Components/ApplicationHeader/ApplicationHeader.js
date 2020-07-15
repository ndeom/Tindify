import React, { useState, useContext } from "react";
import { userContext } from "../../UserProvider";
import NavButton from "./NavButton/NavButton";
import ProfileChip from "./ProfileChip/ProfileChip";
import { useScrollPosition } from "../../utils/useScrollPosition";
import "./ApplicationHeader.scss";

export default function ApplicationHeader() {
  const { userInfo } = useContext(userContext);

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
      </div>
      <ProfileChip profileInfo={userInfo} />
    </div>
  );
}
