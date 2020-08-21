import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import UserProvider, { userContext } from "./UserProvider";
import { CancelAudioProvider, cancelAudioContext } from "./App";
import {
  userInfo,
  categoryData,
  playlistTracks,
  devices,
  snapshot,
  playlists,
  userPlaylists,
} from "./mock-data";
import SpotifyWebApi from "spotify-web-api-js";
jest.mock("spotify-web-api-js");

//Mock SpotifyWebApi class methods
const mockGetMe = jest.fn().mockReturnValue(Promise.resolve(userInfo));
const mockGetCategories = jest
  .fn()
  .mockReturnValue(Promise.resolve(categoryData));
const mockGetCategoryPlaylists = jest
  .fn()
  .mockReturnValue(Promise.resolve(playlists));
const mockGetPlaylistTracks = jest
  .fn()
  .mockReturnValue(Promise.resolve(playlistTracks));
const mockGetMyDevices = jest.fn().mockReturnValue(Promise.resolve(devices));
const mockCreatePlaylist = jest.fn().mockReturnValue(Promise.resolve(snapshot));
const mockGetUserPlaylists = jest
  .fn()
  .mockReturnValue(Promise.resolve(userPlaylists));
const mockPause = jest.fn().mockReturnValue(Promise.resolve());
const mockPlay = jest.fn().mockReturnValue(Promise.resolve());

//Mock methods added to mocked class
SpotifyWebApi.prototype.getMe = mockGetMe;
SpotifyWebApi.prototype.getCategories = mockGetCategories;
SpotifyWebApi.prototype.getCategoryPlaylists = mockGetCategoryPlaylists;
SpotifyWebApi.prototype.getPlaylistTracks = mockGetPlaylistTracks;
SpotifyWebApi.prototype.getMyDevices = mockGetMyDevices;
SpotifyWebApi.prototype.createPlaylist = mockCreatePlaylist;
SpotifyWebApi.prototype.getUserPlaylists = mockGetUserPlaylists;
SpotifyWebApi.prototype.pause = mockPause;
SpotifyWebApi.prototype.play = mockPlay;

const history = createMemoryHistory();

//Wrapper custom render function to be used for testing
function RouterAndProviders({ children }) {
  return (
    <Router history={history}>
      <UserProvider>
        <CancelAudioProvider>{children}</CancelAudioProvider>
      </UserProvider>
    </Router>
  );
}

const customRender = (ui, options) => {
  return render(ui, { wrapper: RouterAndProviders, ...options });
};

//re-export all contents of testing library
export * from "@testing-library/react";

export { customRender, history };
