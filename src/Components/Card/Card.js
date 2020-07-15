import React, { useState, useEffect, useContext } from "react";
//import { atom, useRecoilState } from "recoil";
import { userContext } from "../../UserProvider";
import { animated } from "react-spring";
import SpotifyWebApi from "spotify-web-api-js";
import TimeBar from "./TimeBar/TimeBar";
import ButtonControls from "./ButtonControls/ButtonControls";
import "./Card.scss";

// export const trackColor = atom({
//   key: "primaryColor",
//   default: "#282828",
// });

export default function Card({ i, bind, styles, track }) {
  const { userToken, tokenTimeout, getNewToken } = useContext(userContext);
  //const [color, setColor] = useRecoilState(trackColor);
  const artist = track.track.artists[0].name;
  const song = track.track.name;
  const id = track.track.id;
  const length = track.track.duration_ms;
  const primaryColor = track.primary_color || "#282828";

  //console.log("Recoild State Color: ", color);
  console.log("primaryColor: ", primaryColor);

  useEffect(() => {
    // if (primaryColor !== color) {
    //   setColor(primaryColor);
    // }
    // const spotify = new SpotifyWebApi();
    // console.log(spotify);
    // spotify.setAccessToken(userToken);
    // const track = spotify
    //   .getTrack(id)
    //   .then((track) => console.log("track info", track));
  }, []);

  return (
    <animated.div
      {...bind(i)}
      style={{ ...styles, backgroundColor: primaryColor }}
      className="card"
    ></animated.div>
  );
}
