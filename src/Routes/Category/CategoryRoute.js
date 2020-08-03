import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Playlist from "../../Components/Playlist/Playlist";
import RouteHeader from "../../Components/RouteHeader/RouteHeader";
import Loading from "../../Components/Loading/Loading";
import { userContext } from "../../UserProvider";
import { useScrollPosition } from "../../utils/useScrollPosition";
import "./CategoryRoute.scss";

export default function CategoryRoute(props) {
  const [currentPlaylists, setCurrentPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noReturnedPlaylists, setReturnedNoPlaylists] = useState(false);
  const [morePlaylists, setMorePlaylists] = useState(false);
  const [offset, setOffset] = useState(0);
  const { userToken, tokenTimeout, getNewToken, spotify } = useContext(
    userContext
  );
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const currCategory = params.category;
  const currentDate = new Date();
  const needNewToken = tokenTimeout < currentDate.getTime();

  useEffect(() => {
    if (!currentPlaylists.length && !needNewToken) {
      console.log(spotify);
      //Probably don't need to set token here
      //Consider removing and adding to condition for new token below

      //spotify.setAccessToken(userToken);
      spotify
        .getCategoryPlaylists(currCategory)
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
      setLoading(true);
      console.log("LOADING");
      console.log("offset is: ", offset);
      spotify
        .getCategoryPlaylists(currCategory, { offset })
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
            There was either an error or no playlist results were returned.
            Either navigate back to the Browse route and pick a new category or
            refresh the page.
          </div>
        )}
      </div>
    </div>
  );
}
