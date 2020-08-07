import React, { useState, useContext } from "react";
import { userContext } from "../../../UserProvider";
import { ReactComponent as PlaceholderAvi } from "../../Images/PlaceholderAvi.svg";
import "./ProfileChip.scss";

export default function ProfileChip(props) {
  const [isToggled, setIsToggled] = useState(false);

  // console.log("props in profileChip: ", props);
  // console.log("images: ", props.profileInfo);

  return (
    <button
      id="profile-chip"
      className={`${isToggled ? "active" : ""}`}
      onClick={() => setIsToggled(!isToggled)}
      onBlur={() => setIsToggled(false)}
    >
      {Object.keys(props.profileInfo).length &&
      props.profileInfo.images.length ? (
        <img src={props.profileInfo.images[0].url} alt="Avatar" />
      ) : (
        <div id="placeholder-background">
          <PlaceholderAvi id="placeholder-avi" />
        </div>
      )}

      <div id="chip-name">{props.profileInfo.display_name}</div>
      <div id="menu-down-toggle" className={`${isToggled ? "down" : ""}`}>
        <svg viewBox="0 0 24 24" className="arrow-svg">
          <path
            fill="currentColor"
            d="M15.54 21.15L5.095 12.23 15.54 3.31l.65.76-9.555 8.16 9.555 8.16"
          ></path>
        </svg>
      </div>
      {isToggled && <ToggleDropdown />}
    </button>
  );
}

function ToggleDropdown() {
  const { logoutUser } = useContext(userContext);

  return (
    <ul
      id="drop-down-menu"
      onClick={() => {
        logoutUser();
      }}
    >
      <li>Logout</li>
    </ul>
  );
}
