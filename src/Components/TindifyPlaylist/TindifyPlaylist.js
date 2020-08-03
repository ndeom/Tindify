import React, { useState, useContext, useEffect } from "react";
import { userContext } from "../../UserProvider";
import Loading from "../Loading/Loading";
import "./TindifyPlaylist.scss";

export default function TindifyPlaylist() {
  const { spotify, userInfo } = useContext(userContext);
  const [playlist, setPlaylist] = useState([]);
  const [noPlaylist, setNoPlaylist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playlist.length && !noPlaylist) {
      setLoading(true);
      spotify
        .getUserPlaylists(userInfo.id)
        .then(({ items: userPlaylists }) => {
          setLoading(false);
          const tindify = userPlaylists.filter(
            (playlist) => playlist.name === "Tindify"
          )[0];

          console.log("Tindify in playlist: ", tindify);

          //May need to change
          if (!tindify) {
            setNoPlaylist(true);
          } else {
            setPlaylist(tindify.items);
          }
        })
        .catch((err) => {
          console.error("Error getting user's Tindify playlist!", err);
        });
    }
  }, [noPlaylist, playlist.length, spotify, userInfo.id]);

  return (
    <div id="tindify-playlist-container">
      {!!playlist.length && (
        <ul id="tindify-playlist">
          {playlist.map((song) => (
            <PlaylistRow song={song} />
          ))}
        </ul>
      )}
      {!!loading && <Loading />}
      {!!noPlaylist && (
        <div id="no-playlist-warning">
          Looks like you don't have any songs in your Tindify playlist.
        </div>
      )}
    </div>
  );
}

function PlaylistRow({ song }) {
  return <li className="playlist-row">{`Song: ${song}`}</li>;
}
