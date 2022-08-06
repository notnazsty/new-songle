import axios, { AxiosResponse } from "axios";
import {
  TransformedPlaylistData,
  SpotifySavedTracks,
  SpotifySavedTracksItems,
  SpotifyCurrentUserPlaylists,
  SpotifyPlaylist,
  SpotifyPlaylistSongItem,
  SpotifyUserPlaylistSongs,
} from "../../models/spotify/playlists";
import {
  RequestError,
  SpotifyRequestError,
} from "../../models/spotify/requests";
import { Song } from "../../models/spotify/songs";

// Saved Songs (Library)
export const getUserSavedTracksData = async (
  authToken: string,
  userID: string
): Promise<TransformedPlaylistData | RequestError> => {
  let response: AxiosResponse<SpotifyRequestError | SpotifySavedTracks, any> =
    await axios.get(
      "https://api.spotify.com/v1/me/tracks?market=ES&limit=50&offset=0",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

  if ("error" in response.data) {
    return response.data.error;
  }

  return {
    id: userID + "_st0",
    totalCount: response.data.total,
    images: [{ url: "/savedTracks.png", height: 360, width: 360 }],
    public: false,
    name: "Saved Tracks",
  };
};

export const getUserSavedTracks = async (
  authToken: string
): Promise<Song[] | RequestError> => {
  let librarySongs: Song[] = [];

  let response: AxiosResponse<SpotifyRequestError | SpotifySavedTracks, any> =
    await axios.get(
      "https://api.spotify.com/v1/me/tracks?market=ES&limit=50&offset=0",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

  if ("error" in response.data) {
    return response.data.error;
  }

  librarySongs.push(
    ...transformSavedTracksResponseToSongArray(response.data.items)
  );

  while (typeof response.data.next === "string") {
    response = await axios.get(response.data.next, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Most likely hit an API Rate Limit so returning the data I already have saved
    if ("error" in response.data) {
      return librarySongs;
    }

    librarySongs.push(
      ...transformSavedTracksResponseToSongArray(response.data.items)
    );
  }

  return librarySongs;
};

const transformSavedTracksResponseToSongArray = (
  items: SpotifySavedTracksItems[]
): Song[] => {
  let output: Song[] = [];

  items.forEach((item) => {
    if (item.track) {
      const songObject: Song = {
        name: item.track.name,
        album: item.track.album.name,
        artists: item.track.artists.map((artist) => artist.name),
        releaseDate: new Date(item.track.album.release_date)
          .getFullYear()
          .toString(),
        coverImages: item.track.album.images.map((imgObj) => imgObj),
      };
      output.push(songObject);
    }
  });

  return output;
};

export const getUserPlaylists = async (
  accessToken: string
): Promise<TransformedPlaylistData[] | RequestError> => {
  let output: TransformedPlaylistData[] = [];

  let response: AxiosResponse<
    SpotifyRequestError | SpotifyCurrentUserPlaylists,
    any
  > = await axios.get(
    ` https://api.spotify.com/v1/me/playlists?offset=0&limit=20`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );

  if ("error" in response.data) {
    return response.data.error;
  }

  output.push(...tranformCurrentUserPlaylistResponse(response.data.items));

  while (typeof response.data.next === "string") {
    response = await axios.get(response.data.next, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    // Incase you hit an API rate limit it will just return all the playlists that you already got
    if ("error" in response.data) {
      return output;
    }

    output.push(...tranformCurrentUserPlaylistResponse(response.data.items));
  }

  return output;
};

const tranformCurrentUserPlaylistResponse = (
  items: SpotifyPlaylist[]
): TransformedPlaylistData[] => {
  let output: TransformedPlaylistData[] = [];

  items.forEach((item) => {
    const isPublic =
      item.owner.display_name == "Spotify"
        ? true
        : item.public
        ? item.public
        : false;

    const songObject: TransformedPlaylistData = {
      id: item.id,
      totalCount: item.tracks.total,
      images: item.images,
      public: item.public ? item.public : false,
      name: item.name ? item.name : "N/A",
    };
    output.push(songObject);
  });

  return output;
};

export const getPlaylistSongsFromID = async (
  accessToken: string,
  playlistID: string
) => {
  let songsFromPlaylist: Song[] = [];

  let response: AxiosResponse<
    SpotifyRequestError | SpotifyUserPlaylistSongs,
    any
  > = await axios.get(
    `https://api.spotify.com/v1/playlists/${encodeURI(
      playlistID
    )}/tracks?market=ES&limit=50&offset=0`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );

  if ("error" in response.data) {
    return response.data.error;
  }

  songsFromPlaylist.push(
    ...transformPlaylistResponseToSongArray(response.data.items)
  );

  while (typeof response.data.next === "string") {
    response = await axios.get(response.data.next, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    // Incase you hit an API rate limit it will just return all the songs that you already got
    if ("error" in response.data) {
      return songsFromPlaylist;
    }

    songsFromPlaylist.push(
      ...transformPlaylistResponseToSongArray(response.data.items)
    );
  }

  return songsFromPlaylist;
};

const transformPlaylistResponseToSongArray = (
  items: SpotifyPlaylistSongItem[]
): Song[] => {
  let ouput: Song[] = [];

  items.forEach((item) => {
    if (item.track) {
      const songObject: Song = {
        name: item.track.name,
        coverImages: item.track.album.images.map((imageObj) => imageObj),
        album: item.track.album.name,
        releaseDate: new Date(item.track.album.release_date)
          .getFullYear()
          .toString(),
        artists: item.track.artists.map((artist) => artist.name),
      };
      ouput.push(songObject);
    } 
  });

  return ouput;
};
