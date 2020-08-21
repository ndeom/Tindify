import React, { useContext } from "react";
import { userContext } from "../../../UserProvider";
import { cancelAudioContext } from "../../../App";
import { ReactComponent as PlayButton } from "../../Images/circular.svg";
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
  handleLikeOrDislike,
  noPreviewWarning,
  noDeviceWarning,
}) {
  const { setActiveAudio } = useContext(cancelAudioContext);
  const { spotify, previewAudio } = useContext(userContext);

  const togglePlayState = () => {
    if (hasPremium) {
      if (isPlaying) {
        spotify
          .pause({ uris: [uri] })
          .catch((err) => console.error("Error toggling play state", err));
        setActiveAudio(false);
      } else {
        spotify
          .play({
            uris: [uri],
            position_ms: playbackState.current.elapsed,
          })
          .catch((err) => console.error("Error toggling play state", err));
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
    //console.log("isPlaying: ", isPlaying);
    isPlaying ? setIsPlaying(false) : setIsPlaying(true);
    //setIsPlaying(!isPlaying);
  };

  return (
    <div id="button-controls">
      <button
        id="dislike"
        data-testid="dislike-button"
        onClick={() => {
          gone.add(i);
          handleLikeOrDislike(-1);
          previewAudio.pause();
        }}
      >
        <DislikeButton primaryColor={primaryColor} />
      </button>
      <button
        id="play-button"
        className={`${noPreviewWarning || noDeviceWarning ? "disabled" : ""}`}
        disabled={noPreviewWarning || noDeviceWarning}
        onClick={() => togglePlayState()}
      >
        {!isPlaying && <PlayButton />}
        {isPlaying && <Pause />}
      </button>
      <button
        id="like"
        data-testid="like-button"
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
