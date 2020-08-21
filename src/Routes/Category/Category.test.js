import React from "react";
import { customRender, screen, waitFor } from "../../test-utils";
import CategoryRoute from "./CategoryRoute";
import * as getHash from "../../utils/getHashParams";
import * as Spotify from "spotify-web-api-js";

const spySpotify = jest.spyOn(Spotify, "default");

//Mock getHashParams to provide userToken
const spy = jest.spyOn(getHash, "default");
spy.mockImplementation(() => ({
  access_token: "mock_access_token",
  refresh_token: "mock_refresh_token",
}));

//Mock React Router hooks useParams and useLocation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ category: "mock_category_name" }),
  useLocation: () => ({
    state: {
      categoryTitle: "mock_playlist_name",
    },
  }),
}));

describe("<CategoryRoute />", () => {
  test("should contain the RouteHeader component and render 3 playlists", async () => {
    customRender(<CategoryRoute />);

    expect(screen.getByTestId("route-header")).toBeInTheDocument();
    expect(screen.getByTestId("route-header-title")).toHaveTextContent(
      "mock_playlist_name"
    );

    expect(screen.getByTestId("category-route")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId("playlist").length).toBe(3);
    });
  });

  test("should throw error with incorrectly formatted data", async () => {
    class SpotifyWebApi {
      setAccessToken() {
        return Promise.resolve();
      }

      getMe() {
        return Promise.resolve();
      }

      getCategoryPlaylists() {
        return Promise.resolve({ wrong: "key" });
      }
    }

    //Mock the spotify class just for this test
    spySpotify.mockImplementation(() => {
      return new SpotifyWebApi();
    });

    //Reassign console.error to consoleLogger variable to be able to test against
    //console output
    let consoleOutput = [];
    const consoleLogger = (output) => consoleOutput.push(output);
    console.error = consoleLogger;

    // expect(() => customRender(<Browse />)).toThrow(TypeError);
    customRender(<CategoryRoute />);

    await waitFor(() => {
      expect(screen.getByTestId("category-route")).toBeInTheDocument();
    });

    //Expect "Error loading categories" to be in the console.error output
    //at least once
    expect(
      consoleOutput.filter((error) =>
        error.includes("Error getting category playlists!")
      ).length
    ).toBeGreaterThanOrEqual(1);
  });
});
