import React, { useState } from "react";
import { useTransition, animated } from "react-spring";
import "./NoDeviceWarning.scss";

export default function NoDeviceWarning({ noDeviceWarning }) {
  const [toggled] = useState(noDeviceWarning);

  // console.log(
  //   "%c no preview warning",
  //   "background: #000; color: red; font-size: 24px;",
  //   noDeviceWarning
  // );

  const transition = useTransition(toggled, null, {
    from: { top: -200 },
    enter: { top: 30 },
    leave: { top: -200 },
  });

  return transition.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props} id="no-device-warning">
          <span className="warning-top-line">Sorry.</span>
          <span className="warning-body">
            It looks like there isn't an active audio device. Click{" "}
            <a
              href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>{" "}
            to open up a player, or open Spotify on your phone or TV. Refresh
            the page when you're done.
          </span>
        </animated.div>
      )
  );
}
