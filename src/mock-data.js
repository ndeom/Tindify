//Mock Category data
export const categoryData = {
  categories: {
    items: [
      {
        id: "mock_pathname",
        name: "mock_name",
        icons: [{ url: "mock_url" }],
      },
      {
        id: "mock_pathname",
        name: "mock_name",
        icons: [{ url: "mock_url" }],
      },
      {
        id: "mock_pathname",
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
          images: [
            { url: "mock_image_url" },
            { url: "mock_image_url" },
            { url: "mock_image_url" },
          ],
          name: "mock_album_name",
        },
        artists: [{ name: "mock_artist_name" }],
        duration_ms: 0,
        id: "mock_track_id",
        name: "mock_track_name",
        uri: "mock_track_uri",
        url: "mock_track_url",
        preview_url: "mock_preview_url",
      },
      primary_color: null,
    },
    {
      track: {
        album: {
          images: [
            { url: "mock_image_url" },
            { url: "mock_image_url" },
            { url: "mock_image_url" },
          ],
          name: "mock_album_name",
        },
        artists: [{ name: "mock_artist_name" }],
        duration_ms: 0,
        id: "mock_track_id",
        name: "mock_track_name",
        uri: "mock_track_uri",
        url: "mock_track_url",
        preview_url: "mock_preview_url",
      },
      primary_color: null,
    },
    {
      track: {
        album: {
          images: [
            { url: "mock_image_url" },
            { url: "mock_image_url" },
            { url: "mock_image_url" },
          ],
          name: "mock_album_name",
        },
        artists: [{ name: "mock_artist_name" }],
        duration_ms: 0,
        id: "mock_track_id",
        name: "mock_track_name",
        uri: "mock_track_uri",
        url: "mock_track_url",
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
  playlists: {
    items: [
      {
        name: "mock_playlist_name",
        id: "mock_playlist_id",
        images: [
          {
            url: "mock_playlist_image_url",
          },
        ],
      },
      {
        name: "mock_playlist_name",
        id: "mock_playlist_id",
        images: [
          {
            url: "mock_playlist_image_url",
          },
        ],
      },
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
  },
  limit: 50,
};

//Mock User Playlists
export const userPlaylists = {
  items: [
    {
      name: "Tindify",
      id: "mock_user_playlist_id",
      snapshot_id: "mock_user_snapshot_id",
      images: [
        {
          url: "mock_user_playlist_image_url",
        },
      ],
    },
  ],
};

//Mock user information
export const userInfo = {
  display_name: "mock_display_name",
  images: [{ url: "mock_profile_image_url" }],
  product: "premium",
};
