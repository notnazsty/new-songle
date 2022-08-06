import { SpotifyImageObject } from "../spotify/songs";

export interface AccountCollectionDoc {
  email: string | null;
  displayName: string;
  spotifyConnected: boolean;
  gameWins: number;
  gameLosses: number;
  totalScore: number;
  id: string;
  spotifyID: string | null;
  playlistIDs: string[];
  usersSpotifyTokenData: UsersSpotifyTokenData | null;
  spotifyProfileData: UserSpotifyProfileData | null;
}

export interface UserSpotifyProfileData {
  country: string;
  display_name: string;
  email: string;
  href: string;
  id: string;
  images: SpotifyImageObject[];
}

export interface UsersSpotifyTokenData {
  accessToken: string | null;
  tokenType: string;
  lastRequested: Date;
  refreshToken: string | null;
  scope: string;
}
