import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Login from "./Routes/Login/Login";
import Browse from "./Routes/Browse/Browse";
import Swipe from "./Routes/Swipe/Swipe";
import ApplicationHeader from "./Components/ApplicationHeader/ApplicationHeader";
import CategoryRoute from "./Routes/Category/CategoryRoute";
import { userContext } from "./UserProvider";
import "./App.scss";

function App() {
  const { userToken } = useContext(userContext);

  return (
    <Switch>
      <Route exact path="/">
        {userToken ? <Redirect to="/browse" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/browse">
        <ApplicationHeader />
        <Browse />
      </Route>
      <Route path="/:category/swipe/:playlist">
        <ApplicationHeader />
        <RecoilRoot>
          <Swipe />
        </RecoilRoot>
      </Route>
      <Route path="/:category">
        <ApplicationHeader />
        <CategoryRoute />
      </Route>
    </Switch>
  );
}

export default App;
