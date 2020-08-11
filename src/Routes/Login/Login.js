import React from "react";
import "./Login.scss";

export default function Login() {
  return (
    <div id="login" data-testid="login">
      <h1 data-testid="login-title">Tindify</h1>
      <a
        href="https://tindify-web.herokuapp.com/api/login"
        data-testid="login-button"
      >
        {" "}
        Sign in with Spotify{" "}
      </a>
      {/* <a href="http://localhost:8080/api/login"> Sign in with Spotify </a> */}
    </div>
  );
}
