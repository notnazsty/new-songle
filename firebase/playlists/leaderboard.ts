import { leaderboardsRef } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  LeaderboardCollection,
  LeaderboardScores,
} from "models/firebase/leaderboard";

export const loadLeaderboard = async (
  playlistID: string
): Promise<LeaderboardCollection> => {
  const currentLeaderboardDoc = await getDoc(doc(leaderboardsRef, playlistID));

  if (currentLeaderboardDoc.exists()) {
    return currentLeaderboardDoc.data() as LeaderboardCollection;
  } else {
    const newLeaderboard = await createLeaderboard(playlistID);
    return newLeaderboard;
  }
};

export const createLeaderboard = async (
  playlistID: string
): Promise<LeaderboardCollection> => {
  const leaderboardObj: LeaderboardCollection = {
    playlistID: playlistID,
    top: [],
    lastUpdated: new Date(),
    gamesPlayed: 0,
  };

  await setDoc(doc(leaderboardsRef, playlistID), leaderboardObj);

  return leaderboardObj;
};

export const addNewScoreToLeaderboard = async (
  leaderboard: LeaderboardCollection,
  newScoreData: LeaderboardScores,
  playlistID: string
) => {
  if (leaderboard.top.length === 0) {
    await setDoc(doc(leaderboardsRef, playlistID), {
      playlistID: playlistID,
      top: [newScoreData],
      lastUpdated: new Date(),
      gamesPlayed: leaderboard.gamesPlayed + 1,
    });
  } else {

    // Handle updating scores for the same player

    await setDoc(doc(leaderboardsRef, playlistID), {
      playlistID: playlistID,
      top: [...leaderboard.top, newScoreData].sort(
        (a: LeaderboardScores, b: LeaderboardScores) => {
          if (a.score > b.score) {
            return 1;
          }
          if (a.score < b.score) {
            return -1;
          }
          return 0;
        }
      ),
      lastUpdated: new Date(),
      gamesPlayed: leaderboard.gamesPlayed + 1,
    });
  }
};
