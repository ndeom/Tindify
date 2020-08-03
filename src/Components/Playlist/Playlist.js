import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Playlist.scss";

export default function Playlist({ currCategory, info, history }) {
  const [playlistColor, setPlaylistColor] = useState("");

  //Generates a random color for each playlist tile
  const backgroundColor = `rgb(
    ${getRandomNum()},
    ${getRandomNum()},
    ${getRandomNum()}
    )`;

  const { name: playlistTitle, id: playlistId, images } = info;
  const pathname = `/${currCategory}/swipe/${playlistTitle}`;

  if (!playlistColor) {
    setPlaylistColor(backgroundColor);
  }

  //console.log("props.INFO", props.info);

  return (
    <Link
      to={{
        pathname: pathname,
        state: {
          playlistColor,
          playlistTitle,
          playlistId,
          currCategory,
        },
      }}
      className="playlist"
      style={{ backgroundColor: playlistColor }}
    >
      <div className="gradient">
        <h3 className="playlist-title">{`${playlistTitle}`}</h3>
        <img
          className="playlist-image"
          alt="Playlist"
          src={`${images[0].url}`}
        />
      </div>
    </Link>
  );
}

function getRandomNum() {
  return Math.floor(Math.random() * 255);
}
