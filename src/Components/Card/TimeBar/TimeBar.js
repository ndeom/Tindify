import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../../UserProvider";
import "./TimeBar.scss";

let i = 0;
let getPlaybackUpdate = i % 10 === 0;

export default function TimeBar({
  trackLength,
  isPlaying,
  playbackState,
  hasPremium,
  previewAudio,
  songEnded,
  setSongEnded,
  currentIndex,
}) {
  const { spotify } = useContext(userContext);

  const trackDuration = hasPremium ? trackLength : 30000;

  const [time, setTime] = useState({
    elapsed: 0,
    remaining: trackDuration,
  });

  //Handles end of song for premium users

  //Updates time bar
  useEffect(() => {
    let updatedTime;

    //Keeps spotify from returning position_ms value of 0, causing
    //elapsed time to display 0 when song ends
    const premiumUpdateCutoff = time.elapsed < trackDuration - 15000;

    const updateSpotifyPlaybackState = () => {
      try {
        spotify.getMyCurrentPlaybackState().then((playback) => {
          const progress = +playback.progress_ms;
          updatedTime = {
            elapsed: progress,
            remaining: trackDuration - progress,
          };
          setTime({ ...time, ...updatedTime });
          playbackState.current = {
            ...playbackState.current,
            ...updatedTime,
          };
        });
      } catch (err) {
        console.error("Error updating spotify playback state!", err);
        console.log("Updating normally");
        tickNormally();
      }
    };

    const updatePreviewPlaybackState = () => {
      updatedTime = {
        elapsed: previewAudio.currentTime * 1000,
        remaining: trackDuration - previewAudio.currentTime * 1000,
      };

      setTime({ ...time, ...updatedTime });
      playbackState.current = { ...playbackState.current, ...updatedTime };
    };

    const tickNormally = () => {
      updatedTime = {
        elapsed: time.elapsed + 1000,
        remaining: trackDuration - time.elapsed - 1000,
      };
      setTime({ ...time, ...updatedTime });
      playbackState.current = { ...playbackState.current, ...updatedTime };
    };

    // console.log(
    //   "TimeBar, isPlaying: ",
    //   isPlaying,
    //   "songEnded: ",
    //   songEnded,
    //   "currentIndex: ",
    //   currentIndex
    // );

    if (isPlaying && !songEnded) {
      let timeout = window.setTimeout(() => {
        if (hasPremium && getPlaybackUpdate && premiumUpdateCutoff) {
          updateSpotifyPlaybackState();
        } else if (!hasPremium && getPlaybackUpdate) {
          updatePreviewPlaybackState();
        } else {
          tickNormally();
        }
        i++;
      }, 1000);

      return () => window.clearTimeout(timeout);
    }
  }, [
    currentIndex,
    hasPremium,
    isPlaying,
    playbackState,
    previewAudio.currentTime,
    trackDuration,
    songEnded,
    spotify,
    time,
  ]);

  //Corrects time when premium playback ends
  useEffect(() => {
    if (hasPremium && time.elapsed >= trackDuration) {
      setTime({ elapsed: trackDuration, remaining: 0 });
      playbackState.current = { elapsed: trackDuration, remaining: 0 };
      setSongEnded(true);
    }
  }, [hasPremium, playbackState, setSongEnded, time.elapsed, trackDuration]);

  return (
    <div className="time-bar">
      <div className="track">
        <div
          className="progress-bar"
          style={{
            width: time.elapsed ? (time.elapsed / trackDuration) * 250 : 0,
          }}
        ></div>
        <div
          className="pin"
          style={{
            left: time.elapsed ? (time.elapsed / trackDuration) * 250 : 0,
          }}
        ></div>
      </div>
      <div className="elapsed-time">{formatMsToMin(time.elapsed)}</div>
      <div className="remaining-time">{`-${formatMsToMin(
        time.remaining
      )}`}</div>
    </div>
  );
}

function formatMsToMin(ms) {
  let minutes = `${Math.floor(ms / 1000 / 60)}`;
  let seconds = `${Math.floor((ms - minutes * 60 * 1000) / 1000)}`;

  return `${minutes}:${seconds.length === 1 ? `0${seconds}` : seconds}`;
}
