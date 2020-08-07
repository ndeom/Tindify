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

  const history = useHistory();

  useEffect(() => {
    const currentDate = new Date();
    const needNewToken = tokenTimeout < currentDate.getTime();
    if (!Object.keys(categories).length && !needNewToken) {
      setLoading(true);
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
    <div className="browse">
      <RouteHeader title={"Browse"} />
      <section className="category-section" aria-label="Browse categories">
        <div className="categories">
          {!!Object.keys(categories).length &&
            categories.items.map((category, i) => (
              <Category key={`cat-${i}`} info={category} history={history} />
            ))}
          {loading && <Loading />}
        </div>
      </section>
    </div>
  );
}
