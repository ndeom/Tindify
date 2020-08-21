import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import querystring from "querystring";
import usePersistedState from "./utils/usePersistedState";
import getHashParams from "./utils/getHashParams";

export const userContext = React.createContext("");

export default function UserProvider({ children }) {
  let userTokenKey, userInfoKey, refreshTokenKey, tokenTimeoutKey;
  const [userToken, setUserToken] = usePersistedState(userTokenKey, "");
  const [userInfo, setUserInfo] = usePersistedState(userInfoKey, {});
  const [refreshToken, setRefreshToken] = usePersistedState(
    refreshTokenKey,
    ""
  );
  const [tokenTimeout, setTokenTimeout] = usePersistedState(
    tokenTimeoutKey,
    ""
  );

  //Need to create previewAudio here and pass through provider
  const [spotify] = useState(new SpotifyWebApi());

  const [previewAudio] = useState(new Audio());

  const params = getHashParams();
  const [token, setToken] = useState(params.access_token || null);
  const [refresh, setRefresh] = useState(params.refresh_token || null);
  // console.log("Window.location: ", window.history);
  // console.log("PARAMS IN USERPROVIDER: ", params);
  // console.log("Token inside UserProvider: ", token);
  // console.log("Refresh Token inside UserProvider", refresh);

  const history = useHistory();

  const getNewToken = async () => {
    try {
      //Had to pull refresh token from storage. refreshToken value
      //unavailable for some reason.
      const refresh_token = localStorage.getItem("refreshTokenKey");
      const response = await fetch(
        "https://tindify-web.herokuapp.com/api/refresh_token?" +
          querystring.stringify({ refresh_token })
      );
      const newToken = await response.json();
      setUserToken(newToken.access_token);
      localStorage.setItem("userTokenKey", newToken.access_token);
      let tokenTimeout = Date.now() + 3000 * 1000;
      setTokenTimeout(tokenTimeout);
      localStorage.setItem("tokenTimeoutKey", tokenTimeout);
    } catch (error) {
      console.error("Error occurred while refreshing token: ", error);
    }
  };

  const logoutUser = () => {
    spotify.pause();
    setRefresh("");
    setToken("");
    setUserToken("");
    setUserInfo({});
    setRefreshToken("");
    setTokenTimeout("");
    localStorage.clear();
    history.push("/login");
  };

  useEffect(() => {
    if (!userToken && localStorage.getItem("userTokenKey")) {
      setUserToken(localStorage.getItem("userTokenKey"));
      let userObj = JSON.parse(localStorage.getItem("userInfoKey"));
      setUserInfo(userObj);
      setRefreshToken(localStorage.getItem("refreshTokenKey"));
      setTokenTimeout(localStorage.getItem("tokenTimeoutKey"));
    }

    if (!userToken && token) {
      setUserToken(token);
      localStorage.setItem("userTokenKey", token);

      let tokenTimeout = Date.now() + 3000 * 1000;
      setTokenTimeout(tokenTimeout);
      localStorage.setItem("tokenTimeoutKey", tokenTimeout);

      setRefreshToken(refresh);
      localStorage.setItem("refreshTokenKey", refresh);

      spotify.setAccessToken(token);
      spotify.getMe().then((user) => {
        // console.log("User info: ", user);
        setUserInfo(user);
        localStorage.setItem("userInfoKey", JSON.stringify(user));
      });
      history.push("/");
    }

    // if (!userToken && token === null) {
    //   console.error("Error getting access token! Redirected to login.");
    //   history.push("/login");
    // }
  }, [
    history,
    refresh,
    setRefreshToken,
    setTokenTimeout,
    setUserInfo,
    setUserToken,
    spotify,
    token,
    userToken,
  ]);

  return (
    <userContext.Provider
      value={{
        userToken,
        userInfo,
        tokenTimeout,
        getNewToken,
        logoutUser,
        spotify,
        previewAudio,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
