import { SpotifyImageObject } from "models/spotify/songs";

export interface LeaderboardCollection {
  playlistID: string;
  top: LeaderboardScores[];
  lastUpdated: Date;
  gamesPlayed: number;
}

export interface LeaderboardScores {
  id: string;
  name: string;
  score: number;
  numCorrect: number;
  profile: SpotifyImageObject[];
}
