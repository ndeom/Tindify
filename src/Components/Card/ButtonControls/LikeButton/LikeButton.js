import React from "react";
import hexToRgba from "../../../../utils/hexToRgba";
import "./LikeButton.scss";

export default function LikeButton({ primaryColor }) {
  const filteredPrimary = hexToRgba(primaryColor, 1, 0.75);
  return (
    <svg
      className="like-button-svg"
      viewBox="0 0 878 878"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="like-button-circle"
        cx="439"
        cy="439"
        r="439"
        fill="#FFF"
      />

      <path
        d="M556.188 258C529.056 258 504.181 266.598 482.255 283.555C461.234 299.812 447.239 320.518 439 335.574C430.761 320.517 416.766 299.812 395.745 283.555C373.819 266.598 348.944 258 321.812 258C246.098 258 189 319.931 189 402.057C189 490.781 260.233 551.485 368.071 643.383C386.384 658.989 407.141 676.679 428.715 695.545C431.559 698.035 435.211 699.406 439 699.406C442.789 699.406 446.441 698.035 449.285 695.546C470.861 676.677 491.617 658.988 509.94 643.373C617.767 551.485 689 490.781 689 402.057C689 319.931 631.902 258 556.188 258Z"
        fill={filteredPrimary}
        className="like-button-path"
      />
    </svg>
  );
}
