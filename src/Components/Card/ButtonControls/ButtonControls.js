import React, { useContext } from "react";
import { userContext } from "../../../UserProvider";
import { cancelAudioContext } from "../../../App";
import { ReactComponent as PlayButton } from "../../Images/circular.svg";
//import { ReactComponent as Dislike } from "../../Images/DislikeButton.svg";
import LikeButton from "./LikeButton/LikeButton";
import DislikeButton from "./DislikeButton/DislikeButton";
import { ReactComponent as Pause } from "../../Images/pause.svg";
import "./ButtonControls.scss";

export default function ButtonControls({
  uri,
  isPlaying,
  setIsPlaying,
  playbackState,
  primaryColor,
  gone,
  i,
  hasPremium,
  previewAudio,
  handleLikeOrDislike,
}) {
  const { setActiveAudio } = useContext(cancelAudioContext);
  const { spotify } = useContext(userContext);

  const togglePlayState = () => {
    if (hasPremium) {
      if (isPlaying) {
        spotify.pause({ uris: [uri] });
        setActiveAudio(false);
      } else {
        spotify.play({
          uris: [uri],
          position_ms: playbackState.current.elapsed,
        });
        setActiveAudio(true);
      }
    } else {
      if (isPlaying) {
        previewAudio.pause();
        setActiveAudio(false);
      } else {
        previewAudio.play();
        setActiveAudio(true);
      }
    }
    console.log("isPlaying: ", isPlaying);
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="button-controls">
      <button
        id="dislike"
        onClick={() => {
          gone.add(i);
          handleLikeOrDislike(-1);
          previewAudio.pause();
        }}
      >
        <DislikeButton primaryColor={primaryColor} />
      </button>
      <button id="play-button" onClick={() => togglePlayState()}>
        {!isPlaying && <PlayButton />}
        {isPlaying && <Pause />}
      </button>
      <button
        id="like"
        onClick={() => {
          gone.add(i);
          handleLikeOrDislike(1);
          previewAudio.pause();
        }}
      >
        <LikeButton primaryColor={primaryColor} />
      </button>
    </div>
  );
}
