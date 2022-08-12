import { External_URLs, SpotifyImageObject } from "./songs";

export interface SpotifyProfileData {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: External_URLs;
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: SpotifyImageObject[] ;
  product: string;
  type: "user";
  uri: string;
}

export interface SpotifyTokenResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

