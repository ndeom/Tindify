import React, { useContext, useState, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Login from "./Routes/Login/Login";
import Browse from "./Routes/Browse/Browse";
import Swipe from "./Routes/Swipe/Swipe";
import ApplicationHeader from "./Components/ApplicationHeader/ApplicationHeader";
import CategoryRoute from "./Routes/Category/CategoryRoute";
import TindifyPlaylist from "./Routes/TindifyPlaylist/TindifyPlaylist";
import MobileFooter from "./Components/MobileFooter/MobileFooter";
import { userContext } from "./UserProvider";
import "./App.scss";
//import SpotifyWebApi from "spotify-web-api-js";

export const cancelAudioContext = React.createContext({});

export function CancelAudioProvider({ children }) {
  const [cancelAudio, setCancelAudio] = useState(false);
  const [activeAudio, setActiveAudio] = useState(false);

  return (
    <cancelAudioContext.Provider
      value={{
        cancelAudio,
        setCancelAudio,
        activeAudio,
        setActiveAudio,
      }}
    >
      {children}
    </cancelAudioContext.Provider>
  );
}

export default function App() {
  const { userToken } = useContext(userContext);
  return (
    <div id="app" data-testid="app">
      <Switch>
        <Route exact path="/">
          {userToken ? <Redirect to="/browse" /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/browse">
          {userToken || localStorage.getItem("userTokenKey") ? (
            <>
              <ScrollToTop />
              <ApplicationHeader />
              <Browse />
              <MobileFooter />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/mytindify">
          {userToken || localStorage.getItem("userTokenKey") ? (
            <>
              <ScrollToTop />
              <ApplicationHeader />
              <TindifyPlaylist />
              <MobileFooter />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/:category/swipe/:playlist">
          {userToken || localStorage.getItem("userTokenKey") ? (
            <>
              <ScrollToTop />
              <ApplicationHeader />
              <RecoilRoot>
                <Swipe />
              </RecoilRoot>
              <MobileFooter />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/:category">
          {userToken || localStorage.getItem("userTokenKey") ? (
            <>
              <ScrollToTop />
              <ApplicationHeader />
              <CategoryRoute />
              <MobileFooter />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </Switch>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
