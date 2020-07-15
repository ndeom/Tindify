import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Category from "../../Components/Category/Category";
import RouteHeader from "../../Components/RouteHeader/RouteHeader";
import SpotifyWebApi from "spotify-web-api-js";
import { userContext } from "../../UserProvider";
import "./Browse.scss";

export default function Browse(props) {
  const [categories, setCategories] = useState({});
  const { userToken, tokenTimeout, getNewToken } = useContext(userContext);
  console.log("categories: ", categories);

  let history = useHistory();
  const currentDate = new Date();

  console.log("tokenTimeout", tokenTimeout);
  console.log("current date", currentDate.getTime());
  const needNewToken = tokenTimeout < currentDate.getTime();

  useEffect(() => {
    if (!Object.keys(categories).length && !needNewToken) {
      const spotify = new SpotifyWebApi();
      console.log(spotify);
      spotify.setAccessToken(userToken);
      spotify
        .getCategories({ limit: 50 })
        .then((categories) => setCategories(categories.categories))
        .catch((err) => {
          if (err) return console.error(err);
        });
    }

    if (needNewToken) {
      getNewToken();
    }
  });

  return (
    <div id="browse">
      <RouteHeader title={"Browse"} />
      <div id="categories">
        {Object.keys(categories).length &&
          categories.items.map((category, i) => (
            <Category key={`cat-${i}`} info={category} history={history} />
          ))}
      </div>
    </div>
  );
}
