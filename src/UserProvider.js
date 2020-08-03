import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import querystring from "querystring";
import usePersistedState from "./utils/usePersistedState";
import getHashParams from "./utils/getHashParams";

export const userContext = React.createContext("");

export default function UserProvider(props) {
  let userTokenKey, userInfoKey, tokenTimeoutKey;
  const [userToken, setUserToken] = usePersistedState(userTokenKey, "");
  const [userInfo, setUserInfo] = usePersistedState(userInfoKey, {});
  const [tokenTimeout, setTokenTimeout] = usePersistedState(
    tokenTimeoutKey,
    ""
  );
  const [spotify] = useState(new SpotifyWebApi());

  const params = getHashParams();
  const [token, setToken] = useState(params.access_token || null);
  const [refreshToken, setRefreshToken] = useState(
    params.refresh_token || null
  );

  let history = useHistory();

  const getNewToken = async () => {
    try {
      const response = await fetch(
        "/refresh_token" +
          querystring.stringify({ refresh_token: refreshToken })
      );
      console.log("response: ", response);
      const newToken = response.body;
      console.log("newToken: ", newToken);
      setUserToken(newToken);
      localStorage.setItem("userTokenKey", newToken);

      let tokenTimeout = Date.now() + 3000 * 1000;
      setTokenTimeout(tokenTimeout);
      localStorage.setItem("tokenTimeoutKey", tokenTimeout);
    } catch (error) {
      console.error("Error occurred while refreshing token: ", error);
    }
  };

  const logoutUser = () => {
    spotify.pause();
    setToken("");
    setUserToken("");
    setUserInfo({});
    setTokenTimeout("");
    localStorage.clear();
    history.push("/login");
  };

  useEffect(() => {
    if (!userToken && localStorage.getItem("userTokenKey")) {
      console.log(
        "%c Getting from localStorage ",
        "background: #000; color: #bada55"
      );
      setUserToken(localStorage.getItem("userTokenKey"));
      let userObj = JSON.parse(localStorage.getItem("userInfoKey"));
      setUserInfo(userObj);
      setTokenTimeout(localStorage.getItem("tokenTimeoutKey"));
    }
    if (!userToken && token) {
      console.log(
        "%c Setting localStorage ",
        "background: #000; color: #bada55"
      );
      setUserToken(token);
      localStorage.setItem("userTokenKey", token);

      let tokenTimeout = Date.now() + 3000 * 1000;
      setTokenTimeout(tokenTimeout);
      localStorage.setItem("tokenTimeoutKey", tokenTimeout);

      //const spotify = new SpotifyWebApi();
      spotify.setAccessToken(token);
      spotify.getMe().then((user) => {
        setUserInfo(user);
        localStorage.setItem("userInfoKey", JSON.stringify(user));
      });
      history.push("/");
    }
  });

  return (
    <userContext.Provider
      value={{
        userToken,
        userInfo,
        tokenTimeout,
        getNewToken,
        logoutUser,
        spotify,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
}
