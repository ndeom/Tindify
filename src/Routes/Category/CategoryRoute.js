import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Playlist from "../../Components/Playlist/Playlist";
import RouteHeader from "../../Components/RouteHeader/RouteHeader";
import SpotifyWebApi from "spotify-web-api-js";
import { userContext } from "../../UserProvider";
import "./CategoryRoute.scss";

export default function CategoryRoute(props) {
  const [playlists, setPlaylists] = useState({});
  const { userToken, tokenTimeout, getNewToken } = useContext(userContext);
  let params = useParams();
  let history = useHistory();
  let location = useLocation();
  const currCategory = params.category;
  const currentDate = new Date();
  const needNewToken = tokenTimeout < currentDate.getTime();

  useEffect(() => {
    if (!Object.keys(playlists).length && !needNewToken) {
      const spotify = new SpotifyWebApi();
      console.log(spotify);
      spotify.setAccessToken(userToken);
      spotify
        .getCategoryPlaylists(currCategory)
        .then((playlists) => {
          console.log(playlists.playlists);
          setPlaylists(playlists.playlists);
        })
        .catch((err) => {
          if (err) return console.error(err);
        });
    }

    if (needNewToken) {
      getNewToken();
    }
  });

  return (
    <div id="category-route">
      <RouteHeader title={location.state.categoryTitle} />
      <div id="playlists">
        {Object.keys(playlists).length &&
          playlists.items.map((playlist, i) => (
            <Playlist
              key={`playlist-${i}`}
              currCategory={currCategory}
              info={playlist}
              history={history}
            />
          ))}
      </div>
    </div>
  );
}
