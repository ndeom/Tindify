import React, { useState, useLayoutEffect, useContext } from "react";
import { userContext } from "../../UserProvider";
import { atom, useRecoilState } from "recoil";
import Card from "../../Components/Card/Card";
import { useSprings, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";

import "./Deck.scss";
import SpotifyWebApi from "spotify-web-api-js";

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

export default function Deck({
  tracks,
  noDeviceWarning,
  setNoDeviceWarning,
  noPreviewWarning,
  setNoPreviewWarning,
}) {
  const { userInfo, userToken, previewAudio } = useContext(userContext);
  const [currentIndices, setCurrentIndices] = useState([0, 1]);
  const [color, setColor] = useRecoilState(trackColor);
  const [gone] = useState(() => new Set());
  const [props, set] = useSprings(tracks.length, (index) => ({
    ...to(index),
    from: from(index),
  }));
  //const [previewAudio, setPreviewAudio] = useState(new Audio());

  const secondToLastCard = currentIndices[1] === tracks.length - 1;
  const lastCard = currentIndices[0] === tracks.length - 1;
  const noCard = currentIndices.length === 0;

  const handleLikeOrDislike = (direction) => {
    set((i) => {
      if (i === currentIndices[0])
        return { x: (200 + window.innerWidth) * direction, rot: 5 * direction };
      return;
    });

    //Ensure that audio stops when card is swiped
    if (previewAudio.src && !previewAudio.paused) previewAudio.pause();
    //setPreviewAudio(new Audio());

    if (direction === 1) addToPlaylist();

    handleIndexChange();
  };

  const addToPlaylist = async () => {
    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(userToken);

    //console.log("spotify: ", spotify);
    //console.log("user ID: ", userInfo.id);
    try {
      const { items: userPlaylists } = await spotify.getUserPlaylists(
        userInfo.id
      );
      const tindify = userPlaylists.filter(
        (playlist) => playlist.name === "Tindify"
      )[0];

      let playlistId;
      if (!tindify) {
        const playlist = await spotify.createPlaylist(userInfo.id, {
          name: "Tindify",
        });
        playlistId = playlist.id;
      } else {
        playlistId = tindify.id;
      }

      const { items: tindifyTracks } = await spotify.getPlaylistTracks(
        playlistId
      );

      //Check if track is already in playlist. If not, add to playlist.
      const currentTrackUri = tracks[currentIndices[0]].track.uri;

      const filtered = tindifyTracks.filter((track) => {
        return track.track.uri === currentTrackUri;
      });

      if (!filtered.length) {
        const updatedPlaylist = await spotify.addTracksToPlaylist(playlistId, [
          currentTrackUri,
        ]);
      }
    } catch (error) {
      console.error("Error adding song to Tindify playlist!", error);
    }
  };

  const handleIndexChange = () => {
    removeNoPreviewWarning();
    removeNoDeviceWarning();
    setTimeout(() => {
      if (lastCard) {
        //console.log("lastCard set indices");
        setCurrentIndices([]);
      } else if (secondToLastCard) {
        //console.log("second to last set indices");
        setCurrentIndices([currentIndices[0] + 1]);
      } else {
        //console.log("regular set indices");
        setCurrentIndices([currentIndices[0] + 1, currentIndices[1] + 1]);
      }

      // console.log(
      //   "index changed at: ",
      //   Date.now(),
      //   "index is: ",
      //   currentIndices[0]
      // );
      gone.clear();
    }, 200);
  };

  const removeNoPreviewWarning = () => {
    if (noPreviewWarning) setNoPreviewWarning(false);
  };

  const removeNoDeviceWarning = () => {
    if (noDeviceWarning) setNoDeviceWarning(false);
  };

  useLayoutEffect(() => {
    //const lastCard = currentIndices[1] === tracks.length - 1;

    if (noCard) {
      setColor([]);
    } else if (lastCard) {
      const firstCardPrimary =
        tracks[currentIndices[0]].primary_color || "#1DB954";
      setColor([firstCardPrimary]);
    } else {
      const firstCardPrimary =
        tracks[currentIndices[0]].primary_color || "#1DB954";
      const secondCardPrimary =
        tracks[currentIndices[1]].primary_color || "#1DB954";
      setColor([firstCardPrimary, secondCardPrimary]);
    }
  }, [currentIndices, lastCard, noCard, setColor, tracks]);

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
      let flickDirection = xDir > 0 ? 1 : -1;

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
            friction: 14,
            rot,
            tension: 120, //down ? 500 : isGone ? 200 : 500,
          },
        };
      });

      if (!down && gone.size > 0) {
        handleLikeOrDislike(flickDirection);
      }
    }
  );

  if (lastCard) {
    //console.log("LAST CARD RENDER");
    return props.map(({ x, y, rot, scale }, index) => {
      const track = tracks[index];
      const zIndex = tracks.length - index;
      if (index === currentIndices[0]) {
        return (
          <animated.div
            className="deck-container"
            key={index}
            style={{
              //Added to correct stacking order of cards
              zIndex: zIndex,
              transform: interpolate(
                [x, y],
                (x, y) => `translate3d(${x}px,${y}px,0)`
              ),
            }}
          >
            <Card
              previewAudio={previewAudio}
              noPreviewWarning={noPreviewWarning}
              setNoPreviewWarning={setNoPreviewWarning}
              noDeviceWarning={noDeviceWarning}
              setNoDeviceWarning={setNoDeviceWarning}
              currentIndex={currentIndices[0]}
              gone={gone}
              handleLikeOrDislike={handleLikeOrDislike}
              zIndex={zIndex}
              track={track}
              i={index}
              bind={bind}
              styles={{ transform: interpolate([rot, scale], trans) }}
            />
          </animated.div>
        );
      } else {
        //console.log("NO CARDS ");
        return null;
      }
    });
  } else if (noCard) {
    return null;
  } else {
    //console.log("REGULAR RENDER");
    return props.map(({ x, y, rot, scale }, index) => {
      const track = tracks[index];
      const zIndex = tracks.length - index;
      if (index === currentIndices[0] || index === currentIndices[1]) {
        return (
          <animated.div
            className="deck-container"
            key={index}
            style={{
              //Added to correct stacking order of cards
              zIndex: zIndex,
              transform: interpolate(
                [x, y],
                (x, y) => `translate3d(${x}px,${y}px,0)`
              ),
            }}
          >
            <Card
              //spotify={spotify}
              previewAudio={previewAudio}
              noPreviewWarning={noPreviewWarning}
              setNoPreviewWarning={setNoPreviewWarning}
              noDeviceWarning={noDeviceWarning}
              setNoDeviceWarning={setNoDeviceWarning}
              currentIndex={currentIndices[0]}
              gone={gone}
              handleLikeOrDislike={handleLikeOrDislike}
              zIndex={zIndex}
              track={track}
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
}
