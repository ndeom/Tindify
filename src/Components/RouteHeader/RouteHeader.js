import React from "react";
import "./RouteHeader.scss";

export default function RouteHeader(props) {
  return (
    <header className="route-header">
      <h1>{props.title}</h1>
    </header>
  );
}
