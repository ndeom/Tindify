import React from "react";
import { customRender, screen, waitFor } from "../../test-utils";
import Browse from "./Browse";
import * as getHash from "../../utils/getHashParams";
import * as Spotify from "spotify-web-api-js";

//Mock getHashParams to provide userToken
const spy = jest.spyOn(getHash, "default");
spy.mockImplementation(() => ({
  access_token: "mock_access_token",
  refresh_token: "mock_refresh_token",
}));

const spySpotify = jest.spyOn(Spotify, "default");

describe("<Browse /> ", () => {
  test("should contain the RouteHeader element and render three categories when loaded", async () => {
    customRender(<Browse />);

    expect(screen.getByTestId("route-header")).toBeInTheDocument();
    expect(screen.getByTestId("route-header-title")).toHaveTextContent(
      "Browse"
    );

    expect(screen.getByTestId("browse")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId("category").length).toBe(3);
    });
  });

  test("should throw an error when categories cannot be fetched or data has incorrect structure", async () => {
    //Mock the SpotifyWebApi class for this test to return data with the incorrect format
    //and cause the Browse component to throw an error

    class SpotifyWebApi {
      setAccessToken() {
        return Promise.resolve();
      }

      getMe() {
        return Promise.resolve();
      }

      getCategories() {
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
    customRender(<Browse />);

    await waitFor(() => {
      expect(screen.getByTestId("browse")).toBeInTheDocument();
    });

    //Expect "Error loading categories" to be in the console.error output
    //at least once
    expect(
      consoleOutput.filter((error) =>
        error.includes("Error loading categories!")
      ).length
    ).toBeGreaterThanOrEqual(1);
  });
});
