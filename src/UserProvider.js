import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import querystring from "querystring";
import usePersistedState from "./utils/usePersistedState";
import getHashParams from "./utils/getHashParams";

export const userContext = React.createContext("");

export default function UserProvider(props) {
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

  const history = useHistory();

  const getNewToken = async () => {
    try {
      const refresh_token = localStorage.getItem("refreshTokenKey");
      const response = await fetch(
        "http://localhost:8888/refresh_token?" +
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
    // console.log("params token: ", params.refresh_token);
    // console.log("refresh_token: ", refreshToken);
    if (!userToken && localStorage.getItem("userTokenKey")) {
      // console.log(
      //   "user token from storage: ",
      //   localStorage.getItem("userTokenKey")
      // );
      console.log(
        "%c Getting from localStorage ",
        "background: #000; color: #bada55"
      );
      setUserToken(localStorage.getItem("userTokenKey"));
      let userObj = JSON.parse(localStorage.getItem("userInfoKey"));
      setUserInfo(userObj);
      setRefreshToken(localStorage.getItem("refreshTokenKey"));
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

      setRefreshToken(refresh);
      localStorage.setItem("refreshTokenKey", refresh);
      console.log("refresh token set to: ", refresh);

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
        previewAudio,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
}

// const getNewToken = async (refreshToken, setUserToken, setTokenTimeout) => {
//   try {
//     console.log("getting a new token");
//     // console.log("userToken: ", userToken);
//     console.log("refreshToken: ", refreshToken);
//     // console.log(
//     //   "refreshtoken from storage: ",
//     //   localStorage.getItem("refreshTokenKey")
//     // );

//     const response = await fetch(
//       querystring.stringify({ refresh_token: refreshToken })
//     );

//     console.log("response: ", response);
//     const newToken = JSON.parse(response.body);
//     console.log("newToken: ", newToken);
//     setUserToken(newToken);
//     localStorage.setItem("userTokenKey", newToken);
//     let tokenTimeout = Date.now() + 3000 * 1000;
//     console.log("token timeout: ", tokenTimeout);
//     setTokenTimeout(tokenTimeout);
//     localStorage.setItem("tokenTimeoutKey", tokenTimeout);
//   } catch (error) {
//     console.error("Error occurred while refreshing token: ", error);
//   }
// };
