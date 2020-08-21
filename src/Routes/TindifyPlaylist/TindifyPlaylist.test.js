import React from "react";
import { customRender, screen, waitFor } from "../../test-utils";
import TindifyPlaylist from "./TindifyPlaylist";
import * as getHash from "../../utils/getHashParams";
import * as Spotify from "spotify-web-api-js";
import { playlistTracks, userPlaylists, userInfo } from "../../mock-data";

const spySpotify = jest.spyOn(Spotify, "default");

//Mock getHashParams to provide userToken
const spy = jest.spyOn(getHash, "default");
spy.mockImplementation(() => ({
  access_token: "mock_access_token",
  refresh_token: "mock_refresh_token",
}));

describe("<TindifyPlaylist /> ", () => {
  test("should render the user's Tindify playlist with 3 rows (3 songs)", async () => {
    customRender(<TindifyPlaylist />);

    //Expect playlist container and header to be rendered
    expect(
      screen.getByTestId("tindify-playlist-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("tindify-header")).toBeInTheDocument();
    expect(screen.getByTestId("tindify-header-text").textContent).toBe(
      "Tindify"
    );

    //Wait for playlist rows to render
    await waitFor(() => {
      expect(screen.getAllByTestId("playlist-row").length).toBe(3);
    });

    //Expect playlist rows to be populated with mock data
    expect(
      screen
        .getByTestId("playlist-cover-image")
        .src.includes("mock_user_playlist_image_url")
    ).toBeTruthy();

    expect(screen.getAllByTestId("playlist-song-title")[0].textContent).toBe(
      "mock_track_name"
    );
    expect(screen.getAllByTestId("playlist-artist")[0].textContent).toBe(
      "mock_artist_name"
    );
    expect(screen.getAllByTestId("playlist-album")[0].textContent).toBe(
      "mock_album_name"
    );
  });

  test("should throw error when data is not returned or has incorrect structure", async () => {
    let consoleOutput = [];
    const consoleLogger = (output) => consoleOutput.push(output);
    console.error = consoleLogger;

    class SpotifyWebApi {
      setAccessToken() {
        return Promise.resolve();
      }

      getMe() {
        return Promise.resolve(userInfo);
      }

      getUserPlaylists() {
        return Promise.resolve({ wrong: "key" });
      }
    }

    //Mock the spotify class just for this test
    spySpotify.mockImplementation(() => {
      return new SpotifyWebApi();
    });

    customRender(<TindifyPlaylist />);

    await waitFor(() => {
      expect(
        screen.getByTestId("tindify-playlist-container")
      ).toBeInTheDocument();
    });

    //Expect to throw error including message "Error getting user's Tindify playlist!"
    expect(
      consoleOutput.filter((error) =>
        error.includes("Error getting user's Tindify playlist!")
      ).length
    ).toBeGreaterThanOrEqual(1);
  });
});
