import React from "react";
import { render } from "@testing-library/react";
import Login from "./Login";

/**
 * Test that the login route contains a title and a button
 */

describe("<Login /> route", () => {
  test("should contain an h1 element and an anchor button", () => {
    const { getByTestId } = render(<Login />);

    expect(getByTestId("login-title")).toBeInTheDocument();
    expect(getByTestId("login-title")).toHaveTextContent("Tindify");

    expect(getByTestId("login-button")).toBeInTheDocument();
    expect(getByTestId("login-button")).toHaveTextContent(
      "Sign in with Spotify"
    );
  });
});
