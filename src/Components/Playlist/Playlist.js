import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Playlist.scss";

export default function Playlist(props) {
  const [playlistColor, setPlaylistColor] = useState("");

  //Generates a random color for each playlist tile
  const backgroundColor = `rgb(
    ${getRandomNum()},
    ${getRandomNum()},
    ${getRandomNum()}
    )`;

  const playlistTitle = props.info.name;
  const playlistId = props.info.id;
  const pathname = `/${props.currCategory}/swipe/${playlistTitle}`;

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
          src={`${props.info.images[0].url}`}
        />
      </div>
    </Link>
  );
}

function getRandomNum() {
  return Math.floor(Math.random() * 255);
}
