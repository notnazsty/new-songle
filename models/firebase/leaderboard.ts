import { SpotifyImageObject } from "models/spotify/songs";

export interface LeaderboardCollection {
  playlistID: string;
  playlistName: string;
  top: LeaderboardScores[];
  lastUpdated: Date;
  gamesPlayed: number;
}

export interface LeaderboardScores {
  id: string;
  name: string;
  score: number;
  numCorrect: number;
  image: SpotifyImageObject | null;
}
