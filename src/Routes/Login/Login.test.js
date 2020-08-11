import React from "react";
import { render } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import Login from "./Login";

it("should contain an h1 element and an anchor button", () => {
  const { getByTestId } = render(<Login />);

  expect(getByTestId("login-title")).toBeInTheDocument();
  expect(getByTestId("login-title")).toHaveTextContent("Tindify");

  expect(getByTestId("login-button")).toBeInTheDocument();
  expect(getByTestId("login-button")).toHaveTextContent("Sign in with Spotify");
});

it("should match the snapshot", () => {
  const tree = TestRenderer.create(<Login />);
  expect(tree).toMatchSnapshot();
});
