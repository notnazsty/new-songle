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
  try {
    let response: AxiosResponse<SpotifySavedTracks, any> = await axios.get(
      "https://api.spotify.com/v1/me/tracks?market=ES&limit=50&offset=0",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );
    return {
      id: userID + "_st0",
      totalCount: response.data.total,
      images: [{ url: "/savedTracks.png", height: 360, width: 360 }],
      public: false,
      name: "Saved Tracks",
    };
  } catch (err: any) {
    return {
      status: err.response.status,
      message: err.response.data,
    };
  }
};

export const getUserSavedTracks = async (
  authToken: string
): Promise<Song[] | RequestError> => {
  let librarySongs: Song[] = [];

  try {
    let response: AxiosResponse<SpotifySavedTracks, any> = await axios.get(
      "https://api.spotify.com/v1/me/tracks?market=ES&limit=50&offset=0",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    librarySongs.push(
      ...transformSavedTracksResponseToSongArray(response.data.items)
    );

    while (typeof response.data.next === "string") {
      try {
        response = await axios.get(response.data.next, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        });

        librarySongs.push(
          ...transformSavedTracksResponseToSongArray(response.data.items)
        );
      } catch (err: any) {
        // Most likely hit an API Rate Limit so returning the data I already have saved
        return librarySongs;
      }
    }
  } catch (err: any) {
    return {
      status: err.response.status,
      message: err.response.data,
    };
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

  try {
    let response: AxiosResponse<SpotifyCurrentUserPlaylists, any> =
      await axios.get(
        ` https://api.spotify.com/v1/me/playlists?offset=0&limit=20`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );

    output.push(...tranformCurrentUserPlaylistResponse(response.data.items));

    while (typeof response.data.next === "string") {
      try {
        response = await axios.get(response.data.next, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        });

        output.push(
          ...tranformCurrentUserPlaylistResponse(response.data.items)
        );
      } catch (err: any) {
        // Incase you hit an API rate limit it will just return all the playlists that you already got
        return output;
      }
    }
  } catch (err: any) {
    return {
      status: err.response.status,
      message: err.response.data,
    };
  }

  return output;
};

const tranformCurrentUserPlaylistResponse = (
  items: SpotifyPlaylist[]
): TransformedPlaylistData[] => {
  let output: TransformedPlaylistData[] = [];

  items.forEach((item) => {
    //Figure out what this was made for
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
): Promise<RequestError | Song[]> => {
  let songsFromPlaylist: Song[] = [];

  try {
    let response: AxiosResponse<SpotifyUserPlaylistSongs, any> =
      await axios.get(
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

    songsFromPlaylist.push(
      ...transformPlaylistResponseToSongArray(response.data.items)
    );

    while (typeof response.data.next === "string") {
      try {
        response = await axios.get(response.data.next, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        });

        songsFromPlaylist.push(
          ...transformPlaylistResponseToSongArray(response.data.items)
        );
      } catch (err: any) {
        // Incase you hit an API rate limit it will just return all the songs that you already got
        return songsFromPlaylist;
      }
    }
  } catch (err: any) {
    return {
      status: err.response.status,
      message: err.response.data,
    };
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
