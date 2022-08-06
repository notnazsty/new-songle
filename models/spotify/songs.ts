import { Artists, ArtistsBase } from "./artists";

export interface Song {
  name: string;
  album: string;
  artists: string[];
  releaseDate: string;
  coverImages: SpotifyImageObject[];
}

export interface Track {
  album: Album;
  artists: Artists[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: External_IDs;
  external_urls: External_URLs;
  href: string;
  id: string;
  is_playable: boolean;
  linked_form: any; // Don't care about the data in this using any
  restrictions: {
    reason: "market" | "product" | "explicit";
  };
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

interface External_IDs {
  isrc: string;
  ean: string;
  upc: string;
}

export interface External_URLs {
  spotify: string;
}

interface Album {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: string[];
  external_urls: External_URLs;
  href: string;
  id: string;
  images: SpotifyImageObject[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: {
    reason: string;
  };
  type: string;
  uri: string;
  album_group: "album" | "single" | "compilation" | "appears_on";
  artists: ArtistsBase[];
}

export interface SpotifyImageObject {
  url: string;
  height: number;
  width: number;
}
