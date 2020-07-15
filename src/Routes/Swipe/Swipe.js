import React, { useState, useEffect, useContext } from "react";
import { useRecoilValue } from "recoil";
import { trackColor } from "../../Components/Deck/Deck";
import { useLocation } from "react-router-dom";
import SwipeHeader from "../../Components/SwipeHeader/SwipeHeader";
import Deck from "../../Components/Deck/Deck";
import SpotifyWebApi from "spotify-web-api-js";
import { userContext } from "../../UserProvider";
import "./Swipe.scss";

export default function Swipe(props) {
  const [currentTracks, setCurrentTracks] = useState([]);
  const { userToken, tokenTimeout, getNewToken } = useContext(userContext);
  const primaryColors = useRecoilValue(trackColor);
  let location = useLocation();
  const currentDate = new Date();
  const needNewToken = tokenTimeout < currentDate.getTime();

  const { playlistColor, playlistTitle, playlistId } = location.state;

  useEffect(() => {
    if (!currentTracks.length && !needNewToken) {
      const spotify = new SpotifyWebApi();
      spotify.setAccessToken(userToken);
      spotify
        .getPlaylistTracks(playlistId)
        .then((tracks) => {
          console.log("Tracks", tracks);
          setCurrentTracks(tracks.items);
        })
        .catch((err) => console.error(err));
    }

    if (needNewToken) {
      getNewToken();
    }
  });

  console.log("Primary Color Swipe: ", primaryColors[0]);

  return (
    <div id="swipe">
      <SwipeHeader backgroundColor={primaryColors[0]} title={playlistTitle} />
      <div id="swipe-container">
        <div
          id="swipe-container-gradient"
          style={{ backgroundColor: primaryColors[0] }}
        ></div>
        <div id="card-container">
          <Deck tracks={currentTracks} />
        </div>
      </div>
    </div>
  );
}
