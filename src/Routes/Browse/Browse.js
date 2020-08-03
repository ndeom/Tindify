import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Category from "../../Components/Category/Category";
import Loading from "../../Components/Loading/Loading";
import RouteHeader from "../../Components/RouteHeader/RouteHeader";
import { userContext } from "../../UserProvider";
import "./Browse.scss";

export default function Browse(props) {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const { userToken, tokenTimeout, getNewToken, spotify } = useContext(
    userContext
  );
  //console.log("categories: ", categories);

  let history = useHistory();
  const currentDate = new Date();

  //console.log("tokenTimeout", tokenTimeout);
  //console.log("current date", currentDate.getTime());
  const needNewToken = tokenTimeout < currentDate.getTime();

  useEffect(() => {
    if (!Object.keys(categories).length && !needNewToken) {
      setLoading(true);
      console.log("LOADING");
      console.log(spotify);
      spotify.setAccessToken(userToken);
      spotify
        .getCategories({ limit: 50 })
        .then((categories) => {
          setLoading(false);
          setCategories(categories.categories);
        })
        .catch((err) => {
          if (err) return console.error("Error loading categories!", err);
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
        {!!Object.keys(categories).length &&
          categories.items.map((category, i) => (
            <Category key={`cat-${i}`} info={category} history={history} />
          ))}
        {loading && <Loading />}
      </div>
    </div>
  );
}
