import React, { useState, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import Card from "../../Components/Card/Card";
import { useSprings, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";
import "./Deck.scss";

const to = (i) => ({
  x: 0,
  y: 0,
  scale: 1,
  rot: 0,
  delay: i * 100,
});
const from = (i) => ({ x: 0, rot: 0, scale: 1, y: 0 });

const trans = (r, s) => `rotateZ(${r * 15}deg) scale(${s})`;

export const trackColor = atom({
  key: "primaryColor",
  default: ["#282828", "#282828"],
});

export default function Deck({ tracks }) {
  const [currentIndices, setCurrentIndices] = useState([0, 1]);
  const [color, setColor] = useRecoilState(trackColor);
  const [gone] = useState(() => new Set());
  const [props, set] = useSprings(tracks.length, (index) => ({
    ...to(index),
    from: from(index),
  }));

  useEffect(() => {
    console.log("tracks", tracks);
    const firstCardPrimary = tracks.length
      ? tracks[currentIndices[0]].primary_color || "#282828"
      : "#282828";
    const secondCardPrimary = tracks.length
      ? tracks[currentIndices[1]].primary_color || "#282828"
      : "#282828";

    setColor([firstCardPrimary, secondCardPrimary]);

    // if (firstCardPrimary && secondCardPrimary) {
    //   setColor([firstCardPrimary, secondCardPrimary]);
    // }
    // if (firstCardPrimary) {
    //   setColor([firstCardPrimary, color[1]]);
    // }
    // if (secondCardPrimary) {
    //   setColor([color[0], secondCardPrimary]);
    // }
  }, [currentIndices]);

  const bind = useDrag(
    ({
      args: [index], //Array of arguments passed into the bind() function
      down, //The state the mouse press (down = pressed = true)
      movement: [mx], //Movement delta (movement - previous movement)
      distance, //Offset distance (offset is offset from first gesture)
      direction: [xDir], //Direction per axis
      velocity, //Absolute velocity of the gesture (drag)
    }) => {
      const exitVelocity = velocity > 0.2;
      const exitDistance = window.innerWidth * 0.25;
      const flickDirection = xDir > 0 ? 1 : -1;

      //If mouse not pressed (let go) and exit velocity
      //has been reached, add to "gone" set and animate out
      if (!down && exitVelocity) {
        gone.add(index);
      }

      //If mouse not pressed and distance from starting position
      //is greater than the specified exit distance(25% of screen width)
      if (!down && Math.abs(mx) > exitDistance) {
        gone.add(index);
      }

      //Set new properties
      set((i) => {
        //If index is not the index of the selected card,
        //don't change properties and return
        if (index !== i) {
          return;
        }
        const isGone = gone.has(index);
        const x = isGone
          ? (200 + window.innerWidth) * flickDirection
          : down
          ? mx
          : 0;
        const rot = down ? mx * 0.001 : 0;

        const scale = down ? 1.1 : 1;
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: {
            friction: 50,
            rot,
            tension: down ? 500 : isGone ? 200 : 500,
          },
        };
      });

      if (!down && gone.size > 0) {
        setTimeout(() => {
          setCurrentIndices([currentIndices[0] + 1, currentIndices[1] + 1]);
          gone.clear();
        }, 100);
      }
    }
  );

  return props.map(({ x, y, rot, scale }, index) => {
    if (index === currentIndices[0] || index === currentIndices[1]) {
      return (
        <animated.div
          key={index}
          style={{
            //Added to correct stacking order of cards
            zIndex: 100 - index,
            transform: interpolate(
              [x, y],
              (x, y) => `translate3d(${x}px,${y}px,0)`
            ),
          }}
        >
          <Card
            track={tracks[index]}
            i={index}
            bind={bind}
            styles={{ transform: interpolate([rot, scale], trans) }}
          />
        </animated.div>
      );
    } else {
      return null;
    }
  });
}
