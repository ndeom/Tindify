import React, { useState, useEffect, useContext } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { trackColor } from "../../Components/Deck/Deck";
import { useLocation, useHistory } from "react-router-dom";
import SwipeHeader from "../../Components/SwipeHeader/SwipeHeader";
import Deck from "../../Components/Deck/Deck";
import NoPreviewWarning from "../../Components/NoPreviewWarning/NoPreviewWarning";
import NoDeviceWarning from "../../Components/NoDeviceWarning/NoDeviceWarning";
import { userContext } from "../../UserProvider";
import "./Swipe.scss";

export default function Swipe() {
  const [currentTracks, setCurrentTracks] = useState([]);
  const { userToken, tokenTimeout, getNewToken, spotify } = useContext(
    userContext
  );
  const [noPreviewWarning, setNoPreviewWarning] = useState(false);
  const [noDeviceWarning, setNoDeviceWarning] = useState(false);

  let location = useLocation();
  const [playlistTitle] = useState(location.state.playlistTitle);
  const [playlistId] = useState(location.state.playlistId);
  const [currCategory] = useState(location.state.currCategory);

  let history = useHistory();

  useEffect(() => {
    const currentDate = new Date();
    const needNewToken = tokenTimeout < currentDate.getTime();
    if (!currentTracks.length && !needNewToken) {
      //Same comment as category. Most likely need to remove the addition
      //of the token
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

  return (
    <div id="swipe">
      <SwipeHeader title={playlistTitle} />
      <div id="swipe-container">
        <SwipeGradient />
        <div id="card-container">
          {currentTracks.length && (
            <>
              <Deck
                tracks={currentTracks}
                noPreviewWarning={noPreviewWarning}
                setNoPreviewWarning={setNoPreviewWarning}
                noDeviceWarning={noDeviceWarning}
                setNoDeviceWarning={setNoDeviceWarning}
              />
              <button id="swipe-back-button" onClick={() => history.goBack()}>
                {`Find more tracks in ${currCategory}?`}
              </button>
            </>
          )}
        </div>
      </div>
      {noPreviewWarning && (
        <NoPreviewWarning
          noPreviewWarning={noPreviewWarning}
          setNoPreviewWarning={setNoPreviewWarning}
        />
      )}
      {noDeviceWarning && (
        <NoDeviceWarning
          noDeviceWarning={noDeviceWarning}
          setNoDeviceWarning={setNoDeviceWarning}
        />
      )}
    </div>
  );
}

function SwipeGradient() {
  const primaryColors = useRecoilValue(trackColor);

  return (
    <div
      id="swipe-container-gradient"
      style={{ backgroundColor: primaryColors[0] }}
    ></div>
  );
}
