import React from "react";
import hexToRgba from "../../../../utils/hexToRgba";
import "./DislikeButton.scss";

export default function DislikeButton({ primaryColor }) {
  const filteredPrimary = hexToRgba(primaryColor, 1, 0.75);
  return (
    <svg
      className="dislike-button-svg"
      viewBox="0 0 878 878"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="dislike-button-circle"
        cx="439"
        cy="439"
        r="439"
        fill="white"
      />

      <path
        d="M511.538 438.719L648.094 302.163C663.182 287.075 663.182 262.613 648.094 247.549L629.889 229.344C614.797 214.252 590.335 214.252 575.271 229.344L438.719 365.896L302.163 229.316C287.075 214.228 262.613 214.228 247.549 229.316L229.316 247.521C214.228 262.613 214.228 287.075 229.316 302.139L365.896 438.719L229.344 575.271C214.252 590.363 214.252 614.825 229.344 629.889L247.549 648.094C262.637 663.182 287.099 663.182 302.163 648.094L438.719 511.538L575.271 648.094C590.363 663.182 614.825 663.182 629.889 648.094L648.094 629.889C663.182 614.797 663.182 590.335 648.094 575.271L511.538 438.719Z"
        fill={filteredPrimary}
        className="dislike-button-path"
      />
    </svg>
  );
}
