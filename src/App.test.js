import React from "react";
import { customRender, screen, fireEvent, waitFor } from "./test-utils";
import * as getHash from "./utils/getHashParams";
// import SpotifyWebApi from "spotify-web-api-js";
import App from "./App";

//Mock getHashParams to provide userToken
const spy = jest.spyOn(getHash, "default");

describe(" <App /> ", () => {
  test("should render the <Login /> component first", () => {
    customRender(<App />);

    expect(screen.getByTestId("app")).toBeInTheDocument();
    expect(screen.getByTestId("login")).toBeInTheDocument();
  });

  test("should render <Browse /> once a user token is received", async () => {
    //Mock navigating to spotify login page and return access token
    //and refresh token with custom render
    spy.mockImplementation(() => ({
      access_token: "mock_access_token",
      refresh_token: "mock_refresh_token",
    }));

    customRender(<App />);

    //Ensure app rendered
    expect(screen.getByTestId("app")).toBeInTheDocument();

    //Ensure app header rendered
    expect(screen.getByTestId("application-header")).toBeInTheDocument();

    //Ensure route header rendered with text "Browse"
    expect(screen.getByTestId("route-header")).toBeInTheDocument();
    expect(screen.getByTestId("route-header-title")).toHaveTextContent(
      "Browse"
    );

    //Ensure Browse route rendered
    expect(screen.getByTestId("browse")).toBeInTheDocument();

    //Wait for categories to be returned and appear on the DOM
    await waitFor(() => {
      screen.getAllByTestId("category");
    });

    //Make sure that the number of rendered categories is 3
    const categories = screen.getAllByTestId("category");
    expect(categories.length).toBe(3);

    //Make sure that href for each Category includes "mock_pathname"
    expect(
      categories.filter((category) => category.href.includes("mock_pathname"))
        .length
    ).toBe(3);

    //Check that the text for each category is "mock_name"
    const categoryText = screen.getAllByText("mock_name");
    expect(categoryText.length).toBe(3);

    //Check that there is an image for each Category (3) and that the src
    //attribute for each image includes "mock_url"
    const images = screen.getAllByTestId("category-image");
    expect(images.length).toBe(3);
    expect(
      images.filter((image) => image.src.includes("mock_url")).length
    ).toBe(3);
  });

  test("should render <CategoryRoute /> when a Category is clicked", async () => {
    // spy.mockImplementation(() => ({
    //   access_token: "mock_access_token",
    //   refresh_token: "mock_refresh_token",
    // }));

    customRender(<App />);

    await waitFor(() => {
      screen.getAllByTestId("category");
    });

    //Click a Category to render <CategoryRoute />
    fireEvent.click(screen.getAllByTestId("category")[0]);

    //Wait for <CategoryRoute /> to appear
    await waitFor(() => {
      expect(screen.getByTestId("category-route")).toBeInTheDocument();
    });

    expect(screen.getByTestId("route-header")).toBeInTheDocument();
    expect(screen.getByTestId("route-header-title")).toHaveTextContent(
      "mock_name"
    );

    const playlists = screen.getAllByTestId("playlist");

    //Check that there are three Playlist elements rendered
    expect(playlists.length).toBe(3);

    //Check that "mock_name" and "mock_playlist_name" are both in the
    //href attribute of the anchor
    expect(
      playlists.filter(
        (playlist) =>
          playlist.href.includes("mock_name") &&
          playlist.href.includes("mock_playlist_name")
      )
    );

    //Grab playlist images
    const playlistImages = screen.getAllByTestId("playlist-image");

    //Expect there to be 3 images
    expect(playlistImages.length).toBe(3);

    //Expect the src attribute to include "mock_playlist_image_url"
    expect(
      playlistImages.filter((image) =>
        image.src.includes("mock_playlist_image_url")
      )
    );
  });

  test("should render <Swipe /> when Playlist is clicked", async () => {
    // spy.mockImplementation(() => ({
    //   access_token: "mock_access_token",
    //   refresh_token: "mock_refresh_token",
    // }));

    customRender(<App />);

    await waitFor(() => {
      screen.getAllByTestId("category");
    });

    //Click a Category to render <CategoryRoute />
    fireEvent.click(screen.getAllByTestId("category")[0]);

    //Wait for <CategoryRoute /> to appear
    await waitFor(() => {
      expect(screen.getByTestId("category-route")).toBeInTheDocument();
    });

    //Click a Playlist to render <Swipe />
    fireEvent.click(screen.getAllByTestId("playlist")[0]);

    //Wait for <Swipe /> to appear
    await waitFor(() => {
      expect(screen.getByTestId("swipe")).toBeInTheDocument();
    });

    //Expect the swipe header to be rendered with text "mock_playlist_name"
    expect(screen.getByTestId("swipe-header")).toBeInTheDocument();
    expect(screen.getByTestId("swipe-header-title")).toHaveTextContent(
      "mock_playlist_name"
    );

    //Expect that there are two deck containers and two cards rendered within Swipe
    expect(screen.getAllByTestId("deck-container").length).toBe(2);
    expect(screen.getAllByTestId("card").length).toBe(2);
  });

  test("should render <TindifyPlaylist /> when navigation button is pressed in <Browse />", async () => {
    customRender(<App />);

    //Click on MyTindify NavChip
    fireEvent.click(screen.getByTestId("mytindify-navchip"));

    //Wait for <TindifyPlaylist /> to appear
    await waitFor(() => {
      expect(
        screen.getByTestId("tindify-playlist-container")
      ).toBeInTheDocument();
    });

    //Check that the playlist header is present and has
    //text "Tindify"
    expect(screen.getByTestId("tindify-header")).toBeInTheDocument();
    expect(screen.getByTestId("tindify-header-text").textContent).toBe(
      "Tindify"
    );

    //Check that there are 3 rows (3 tracks) in the <TindifyPlaylist /> list
    expect(screen.getAllByTestId("playlist-row").length).toBe(3);
  });

  test(`should be able to navigate App in the following order:
        Browse => CategoryRoute => Swipe => back (CategoryRoute) => 
        back (Browse) => forward (CategoryRoute) => MyTindify => 
        logout (Login)`, async () => {
    customRender(<App />);

    await waitFor(() => {
      screen.getAllByTestId("category");
    });

    //Click a Category to render <CategoryRoute />
    fireEvent.click(screen.getAllByTestId("category")[0]);

    //Wait for <CategoryRoute /> to appear
    await waitFor(() => {
      expect(screen.getByTestId("category-route")).toBeInTheDocument();
    });

    //Click a Playlist to render <Swipe />
    fireEvent.click(screen.getAllByTestId("playlist")[0]);

    //Wait for <Swipe /> to appear
    await waitFor(() => {
      expect(screen.getByTestId("swipe")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("back-navbutton"));

    await waitFor(() => {
      expect(screen.getByTestId("category-route")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("back-navbutton"));

    await waitFor(() => {
      expect(screen.getByTestId("browse")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("forward-navbutton"));

    await waitFor(() => {
      expect(screen.getByTestId("category-route")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("mytindify-navchip"));

    await waitFor(() => {
      expect(
        screen.getByTestId("tindify-playlist-container")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("profile-chip"));

    //Wait for the drop-down menu to render after state change
    await waitFor(() => {
      expect(screen.getByTestId("drop-down-menu")).toBeInTheDocument();
    });

    //Click drop down to log out
    fireEvent.click(screen.getByTestId("drop-down-menu"));

    await waitFor(() => {
      expect(screen.getByTestId("login")).toBeInTheDocument();
    });
  });
});
