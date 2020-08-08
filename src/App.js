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

function App() {
  const { userToken } = useContext(userContext);
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
      <Switch>
        <Route exact path="/">
          {userToken ? <Redirect to="/browse" /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/browse">
          <ScrollToTop />
          <ApplicationHeader />
          <Browse />
          <MobileFooter />
        </Route>
        <Route path="/mytindify">
          <ScrollToTop />
          <ApplicationHeader />
          <TindifyPlaylist />
          <MobileFooter />
        </Route>
        <Route path="/:category/swipe/:playlist">
          <ScrollToTop />
          <ApplicationHeader />
          <RecoilRoot>
            <Swipe />
          </RecoilRoot>
          <MobileFooter />
        </Route>
        <Route path="/:category">
          <ScrollToTop />
          <ApplicationHeader />
          <CategoryRoute />
          <MobileFooter />
        </Route>
      </Switch>
    </cancelAudioContext.Provider>
  );
}

export default App;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
