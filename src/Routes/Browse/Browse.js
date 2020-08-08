import React, { useEffect, useState, useContext } from "react";
//import { useHistory } from "react-router-dom";
import useTooltip from "../../utils/useTooltip";
import Tooltip from "../../Components/Tooltip/Tooltip";
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

  //const history = useHistory();

  const {
    tooltipPosition,
    tooltipBody,
    getTooltipMouseProps,
    showTooltip,
  } = useTooltip();

  useEffect(() => {
    const currentDate = new Date();
    const needNewToken = tokenTimeout < currentDate.getTime();
    if (!Object.keys(categories).length && !needNewToken) {
      setLoading(true);
      spotify.setAccessToken(userToken);
      spotify
        .getCategories({ limit: 50 })
        .then((categories) => {
          //setLoading(false);
          setCategories(categories.categories);
        })
        .catch((err) => {
          setLoading(false);
          if (err) return console.error("Error loading categories!", err);
        });
    }

    if (Object.keys(categories).length && loading) setLoading(false);

    if (needNewToken) {
      getNewToken();
    }
  }, [categories, getNewToken, loading, spotify, tokenTimeout, userToken]);

  return (
    <div className="browse">
      <RouteHeader title={"Browse"} />
      <section className="category-section" aria-label="Browse categories">
        <div className="categories">
          {!!Object.keys(categories).length &&
            categories.items.map((category, i) => (
              <Category
                key={`cat-${i}`}
                info={category}
                getTooltipMouseProps={getTooltipMouseProps}
              />
            ))}
          {loading && <Loading />}
        </div>
      </section>
      <Tooltip
        position={tooltipPosition.current}
        visible={showTooltip}
        body={tooltipBody.current}
      />
    </div>
  );
}
