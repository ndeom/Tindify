import React from "react";
import "./RouteHeader.scss";

export default function RouteHeader(props) {
  return (
    <header className="route-header" data-testid="route-header">
      <h1 data-testid="route-header-title">{props.title}</h1>
    </header>
  );
}
