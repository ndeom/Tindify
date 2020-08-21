//Mock Category data
export const categoryData = {
  categories: {
    items: [
      {
        id: 1,
        name: "mock_name",
        icons: [{ url: "mock_url" }],
      },
      {
        id: 2,
        name: "mock_name",
        icons: [{ url: "mock_url" }],
      },
      {
        id: 3,
        name: "mock_name",
        icons: [{ url: "mock_url" }],
      },
    ],
  },
};

//Mock Playlist Tracks data
export const playlistTracks = {
  items: [
    {
      track: {
        album: {
          images: [{ url: "mock_image_url" }],
          name: "mock_album_name",
        },
        artists: [{ name: "mock_artist_name" }],
        duration_ms: 0,
        id: "mock_track_id",
        name: "mock_track_name",
        uri: "mock_track_uri",
        preview_url: "mock_preview_url",
      },
      primary_color: null,
    },
    {
      track: {
        album: {
          images: [{ url: "mock_image_url" }],
          name: "mock_album_name",
        },
        artists: [{ name: "mock_artist_name" }],
        duration_ms: 0,
        id: "mock_track_id",
        name: "mock_track_name",
        uri: "mock_track_uri",
        preview_url: "mock_preview_url",
      },
      primary_color: null,
    },
  ],
};

//Mock devices
export const devices = {
  devices: [{ id: "mock_device_id" }],
};

//Mock snapshotId
export const snapshot = { snapshot_id: "mock_snapshot_id" };

//Mock Playlists
export const playlists = {
  playlists: [
    {
      name: "mock_playlist_name",
      id: "mock_playlist_id",
      images: [
        {
          url: "mock_playlist_image_url",
        },
      ],
    },
  ],
  limit: 50,
};

//Mock User Playlists
export const userPlaylists = {
  items: {
    name: "Tindify",
    id: "mock_user_playlist_id",
    snapshot_id: "mock_user_snapshot_id",
    images: [
      {
        url: "mock_user_playlist_image_url",
      },
    ],
  },
};

//Mock user information
export const userInfo = {
  display_name: "mock_display_name",
  images: [{ url: "mock_profile_image_url" }],
  product: "premium",
};

/**
 * Mock implementation of the SpotifyWebApi class for
 * testing purposes
 */

class SpotifyWebApi {
  constructor() {
    console.log("mock SpotifyWebApi constructor called");
  }

  setAccessToken() {
    console.log("mock setAccessToken called");
  }

  getCategories() {
    console.log("mock getCategories called");
    // return new Promise((resolve) => resolve(categoryData));
    return Promise.resolve(categoryData);
  }

  getPlaylistTracks() {
    console.log("mock getPlaylistTracks called");
    return new Promise((resolve) => resolve(playlistTracks));
  }

  pause() {
    console.log("mock pause called");
    return new Promise((resolve) => resolve(true));
  }

  play() {
    console.log("mock play called");
    return new Promise((resolve) => resolve(true));
  }

  getMyDevices() {
    console.log("mock getMyDevices called");
    return new Promise((resolve) => resolve(devices));
  }

  removeTracksFromPlaylistInPositions() {
    console.log("mock removeTracksFromPlaylistInPositions called");
    return new Promise((resolve) => resolve(snapshot));
  }

  getUserPlaylists() {
    console.log("mock getUserPlaylists called");
    return new Promise((resolve) => resolve(userPlaylists));
  }

  getMyCurrentPlaybackState() {
    console.log("mock getMyCurrentPlaybackState called");
  }

  getMe() {
    console.log("mock getMe");
    // return new Promise((resolve) => resolve(userInfo));
    return Promise.resolve(userInfo);
  }

  getCategoryPlaylists() {
    console.log("mock getCategoryPlaylists");
    return new Promise((resolve) => resolve(playlists));
  }
}

// const mock = jest.fn().mockImplementation(() => {
//   return { SpotifyWebApi: mockSpotifyWebApi };
// });

// export default mock;

module.exports = SpotifyWebApi;
