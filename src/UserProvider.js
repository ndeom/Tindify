import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import querystring from "querystring";
import usePersistedState from "./utils/usePersistedState";
import getHashParams from "./utils/getHashParams";

export const userContext = React.createContext("");

//let render = 0;

export default function UserProvider(props) {
  let userTokenKey, userInfoKey, tokenTimeoutKey;
  const [userToken, setUserToken] = usePersistedState(userTokenKey, "");
  const [userInfo, setUserInfo] = usePersistedState(userInfoKey, {});
  const [tokenTimeout, setTokenTimeout] = usePersistedState(
    tokenTimeoutKey,
    ""
  );

  const params = getHashParams();
  const token = params.access_token || null;
  const refreshToken = params.refresh_token || null;
  let history = useHistory();

  async function getNewToken() {
    const response = await fetch(
      "/refresh_token" + querystring.stringify({ refresh_token: refreshToken })
    );
    const newToken = await response.json();
    setUserToken(newToken);
    localStorage.setItem("userTokenKey", newToken);

    let tokenTimeout = Date.now() + 3000 * 1000;
    setTokenTimeout(tokenTimeout);
    localStorage.setItem("tokenTimeoutKey", tokenTimeout);
  }

  function logoutUser() {
    setUserToken("");
    setUserInfo({});
    setTokenTimeout("");
    localStorage.clear();
    history.push("/login");
  }

  useEffect(() => {
    if (!userToken && localStorage.getItem("userTokenKey")) {
      setUserToken(localStorage.getItem("userTokenKey"));
      let userObj = JSON.parse(localStorage.getItem("userInfoKey"));
      setUserInfo(userObj);
      setTokenTimeout(localStorage.getItem("tokenTimeoutKey"));
    }
    if (!userToken && token) {
      setUserToken(token);
      localStorage.setItem("userTokenKey", token);

      let tokenTimeout = Date.now() + 3000 * 1000;
      setTokenTimeout(tokenTimeout);
      localStorage.setItem("tokenTimeoutKey", tokenTimeout);

      const spotify = new SpotifyWebApi();
      spotify.setAccessToken(token);
      spotify.getMe().then((user) => {
        setUserInfo(user);
        localStorage.setItem("userInfoKey", JSON.stringify(user));
      });
      history.push("/");
    }
  });

  //render++;
  //console.log("render: ", render);
  return (
    <userContext.Provider
      value={{ userToken, userInfo, tokenTimeout, getNewToken, logoutUser }}
    >
      {props.children}
    </userContext.Provider>
  );
}
