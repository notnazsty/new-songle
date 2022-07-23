import { External_URLs, SpotifyImageObject } from "./songs";

export interface ArtistsBase {
  external_urls: External_URLs;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Artists {
  external_urls: External_URLs;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImageObject;
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

interface Followers {
  href: string | null; // WebApi does not support it so will always be null
  total: number;
}
