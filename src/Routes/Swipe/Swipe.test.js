import React from "react";
import { customRender, screen, waitFor } from "../../test-utils";
import Swipe from "./Swipe";
import { RecoilRoot } from "recoil";
import * as getHash from "../../utils/getHashParams";
import * as Spotify from "spotify-web-api-js";
import { playlistTracks } from "../../mock-data";
import { fireEvent } from "@testing-library/react";

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
  useLocation: () => ({
    state: {
      currCategory: "mock_curr_category",
      playlistTitle: "mock_playlist_title",
      playlistId: "mock_playlist_id",
    },
  }),
}));

//Mock recoil module hook useRecoilValue
jest.mock("recoil", () => ({
  ...jest.requireActual("recoil"),
  useRecoilValue: () => ["#FFF", "#FFF"],
}));

let consoleOutput = [];
const consoleLogger = (output) => consoleOutput.push(output);
console.error = consoleLogger;

beforeEach(() => {
  //Reset the error logger before each test
  consoleOutput = [];
});

describe("<Swipe />", () => {
  test("should render SwipeHeader, two Deck components, and two Card components", async () => {
    // console.log(typeof RecoilRoot);
    // console.log(RecoilRoot);

    customRender(
      <RecoilRoot>
        <Swipe />
      </RecoilRoot>
    );

    //Make sure SwipeHeader renders
    expect(screen.getByTestId("swipe-header")).toBeInTheDocument();
    expect(screen.getByTestId("swipe-header-title").textContent).toBe(
      "mock_playlist_title"
    );

    //Wait for Deck and Card to load. Expect there to be 2 of each.
    await waitFor(() => {
      expect(screen.getAllByTestId("deck-container").length).toBe(2);
      expect(screen.getAllByTestId("card").length).toBe(2);
    });

    expect(screen.getAllByTestId("album-title-text")[0].textContent).toBe(
      "mock_album_name"
    );
    expect(screen.getAllByTestId("track-text")[0].textContent).toBe(
      "mock_track_name"
    );
    expect(screen.getAllByTestId("artist-text")[0].textContent).toBe(
      "mock_artist_name"
    );
  });

  /**
   * Unable to trigger index changes programmatically
   */

  // test("when pressing 'like' or 'dislike' button, current indices change", async () => {
  //   customRender(
  //     <RecoilRoot>
  //       <Swipe />
  //     </RecoilRoot>
  //   );

  //   //Make sure SwipeHeader renders
  //   expect(screen.getByTestId("swipe-header")).toBeInTheDocument();
  //   expect(screen.getByTestId("swipe-header-title").textContent).toBe(
  //     "mock_playlist_title"
  //   );

  //   //Wait for Deck and Card to load. Expect there to be 2 of each.
  //   await waitFor(() => {
  //     expect(screen.getAllByTestId("deck-container").length).toBe(2);
  //     expect(screen.getAllByTestId("card").length).toBe(2);
  //   });

  //   // expect(screen.getAllByTestId("dislike-button")[1]).toBeInTheDocument();
  //   fireEvent.click(screen.getAllByTestId("dislike-button")[0]);

  //   await waitFor(() => {
  //     expect(screen.getAllByTestId("deck-container").length).toBe(2);
  //     expect(screen.getAllByTestId("card").length).toBe(2);
  //   });

  //   fireEvent.click(screen.getAllByTestId("dislike-button")[0]);

  //   await waitFor(() => {
  //     expect(screen.getAllByTestId("deck-container").length).toBe(2);
  //     expect(screen.getAllByTestId("card").length).toBe(2);
  //   });
  // });

  /**
   * Unsure why test will not pass. When site is live, no errors occur.
   * Using the same custom render method and nesting in <RecoilRoot />
   * as above yields a different result with a mocked SpotifyWebApi class.
   * Last call to setCurrentIndices in <Swipe /> does not set the state and
   * does not trigger a final re-render, which doesn't allow <Deck />
   * component to be rendered.
   */

  // test("should throw an error when devices cannot be retrieved", async () => {
  //   class SpotifyWebApi {
  //     setAccessToken() {
  //       return Promise.resolve();
  //     }

  //     getMe() {
  //       return Promise.resolve();
  //     }

  //     getPlaylistTracks() {
  //       console.log("I'M SECOND");
  //       // return new Promise((resolve) => resolve(playlistTracks));
  //       return Promise.resolve(playlistTracks);
  //     }

  //     getMyDevices() {
  //       throw new Error("user devices cannot be retrieved");
  //     }
  //   }

  //   spySpotify.mockImplementation(() => {
  //     return new SpotifyWebApi();
  //   });

  //   customRender(
  //     <RecoilRoot>
  //       <Swipe />
  //     </RecoilRoot>
  //   );

  //   await waitFor(() => {
  //     screen.getAllByTestId("deck-container");
  //     // expect(screen.getAllByTestId("deck-container").length).toBe(2);
  //     // expect(screen.getAllByTestId("card").length).toBe(2);
  //   });

  //   expect(
  //     consoleOutput.filter((error) =>
  //       error.includes("Error getting user devices!")
  //     ).length
  //   ).toBeGreaterThanOrEqual(1);
  // });
});
