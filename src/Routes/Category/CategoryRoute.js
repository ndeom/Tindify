import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Playlist from "../../Components/Playlist/Playlist";
import RouteHeader from "../../Components/RouteHeader/RouteHeader";
import Loading from "../../Components/Loading/Loading";
import { userContext } from "../../UserProvider";
import { useScrollPosition } from "../../utils/useScrollPosition";
import "./CategoryRoute.scss";
import SpotifyWebApi from "spotify-web-api-js";

export default function CategoryRoute(props) {
  const [currentPlaylists, setCurrentPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noReturnedPlaylists, setReturnedNoPlaylists] = useState(false);
  const [morePlaylists, setMorePlaylists] = useState(false);
  const [offset, setOffset] = useState(0);
  const { userToken, tokenTimeout, getNewToken } = useContext(userContext);
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const currCategory = params.category;
  const currentDate = new Date();
  const needNewToken = tokenTimeout < currentDate.getTime();

  useEffect(() => {
    if (!currentPlaylists.length && !needNewToken) {
      const spotify = new SpotifyWebApi();

      spotify.setAccessToken(userToken);
      spotify
        .getCategoryPlaylists(currCategory, { limit: 50 })
        .then(({ playlists }) => {
          console.log("playlists", playlists);

          if (playlists.items.length) {
            setCurrentPlaylists(playlists.items);

            if (playlists.total > playlists.limit) {
              setMorePlaylists(true);
              setOffset(playlists.items.length - 1);
            }
          } else {
            setReturnedNoPlaylists(true);
          }
        })
        .catch((err) => {
          console.error("Error getting category playlists!", err);
        });
    }

    if (needNewToken) {
      getNewToken();
    }
  });

  useScrollPosition(({ prevPos, currPos }) => {
    //console.log("currPos: ", currPos);
    //console.log("window", window.innerHeight);
    const documentHeight = document.body.clientHeight;
    const scrolledToBottom =
      -1 * currPos.y + window.innerHeight === documentHeight;
    if (scrolledToBottom && morePlaylists) {
      const spotify = new SpotifyWebApi();
      spotify.setAccessToken(userToken);
      setLoading(true);
      spotify
        .getCategoryPlaylists(currCategory, { offset, limit: 50 })
        .then(({ playlists }) => {
          const combinedPlaylists = [...currentPlaylists, ...playlists.items];
          setCurrentPlaylists(combinedPlaylists);
          setLoading(false);
          if (offset + playlists.limit < playlists.total) {
            setOffset(combinedPlaylists.length - 1);
          } else {
            setMorePlaylists(false);
          }
        })
        .catch((err) =>
          console.error("Error getting additional playlists!", err)
        );
    }
  });

  return (
    <div id="category-route">
      <RouteHeader title={location.state.categoryTitle} />
      <section className="playlist-section" aria-label="Browse playlists">
        <div id="playlists">
          {!!currentPlaylists.length &&
            currentPlaylists.map((playlist, i) => (
              <Playlist
                key={`playlist-${i}`}
                currCategory={currCategory}
                info={playlist}
                history={history}
              />
            ))}
          {!!loading && <Loading />}
          {!!noReturnedPlaylists && (
            <div id="no-data-warning">
              <span id="oops">Oops...</span>
              <span id="oops-body">
                There was either an error or no playlist results were returned.
                Either navigate back to the Browse route and pick a new category
                or refresh the page.
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
