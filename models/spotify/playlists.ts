import { External_URLs, SpotifyImageObject, Track } from "./songs";

export interface SpotifySavedTracks {
  href: string;
  items: SpotifySavedTracksItems[];
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface SpotifySavedTracksItems {
  added_at: string;
  track: Track;
}

export interface SpotifyCurrentUserPlaylists {
  href: string;
  items: SpotifyPlaylist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: External_URLs;
  href: string;
  id: string;
  images: SpotifyImageObject[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: any;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

// Requesting Songs From A Specific Playlist
export interface SpotifyUserPlaylistSongs {
  href: string;
  items: SpotifyPlaylistSongItem[];
  limit: number;
  next: string | null;
  offset: number;
  previous: null | string;
  total: number;
}

export interface SpotifyPlaylistSongItem {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: any;
  track: Track;
  video_thumbnail: {
    url: string | null;
  };
}

export interface TransformedPlaylistData {
  id: string;
  totalCount: number;
  images: SpotifyImageObject[];
  public: boolean;
  name: string;
}
