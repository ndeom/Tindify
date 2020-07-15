import React, { useState, useContext } from "react";
import { userContext } from "../../../UserProvider";
import "./ProfileChip.scss";

export default function ProfileChip(props) {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <button
      id="profile-chip"
      className={`${isToggled ? "active" : ""}`}
      onClick={() => setIsToggled(!isToggled)}
    >
      <img
        src={
          Object.keys(props.profileInfo).length
            ? props.profileInfo.images[0].url
            : ""
        }
        alt="Avatar"
      />

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
    <div id="drop-down-menu" onClick={() => logoutUser()}>
      <span>Logout</span>
    </div>
  );
}
