import React, { useState } from "react";
import { useTransition, animated } from "react-spring";
import "./NoPreviewWarning.scss";

export default function NoPreviewWarning({ noPreviewWarning }) {
  const [toggled] = useState(noPreviewWarning);

  // console.log(
  //   "%c no preview warning",
  //   "background: #000; color: red; font-size: 24px;",
  //   noPreviewWarning
  // );
  // console.log("current index: ", currentIndex);
  // console.log("card index: ", index);

  const transition = useTransition(toggled, null, {
    from: { top: -200 },
    enter: { top: 30 },
    leave: { top: -200 },
  });

  return transition.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props} id="no-preview-warning">
          <span className="warning-top-line">Sorry.</span>
          <span className="warning-body">
            It looks like there isn't a preview for this track. Either swipe the
            card or press the like or dislike button to skip to the next one.{" "}
            {/*Click{" "}
            <span onClick={() => setToggled(false)} id="click-to-skip">
              here
      </span>{" "}
            to skip to the next one.*/}
          </span>
        </animated.div>
      )
  );
}
