import React from "react";
import { Link } from "react-router-dom";
import "./Playlist.scss";

export default function Playlist({ currCategory, info, getTooltipMouseProps }) {
  const { name: playlistTitle, id: playlistId, images } = info;
  const pathname = `/${currCategory}/swipe/${playlistTitle}`;

  return (
    <Link
      to={{
        pathname: pathname,
        state: {
          playlistTitle,
          playlistId,
          currCategory,
        },
      }}
      className="playlist"
      {...getTooltipMouseProps({ displayedText: playlistTitle })}
    >
      <img className="playlist-image" alt="Playlist" src={`${images[0].url}`} />
    </Link>
  );
}
