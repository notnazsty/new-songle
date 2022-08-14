import { SetStateAction } from "react";
import { leaderboardsRef } from "../firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
} from "firebase/firestore";
import {
  LeaderboardCollection,
  LeaderboardScores,
} from "models/firebase/leaderboard";

export const loadLeaderboard = (
  playlistID: string,
  playlistName: string,
  setLeaderboard: (value: SetStateAction<LeaderboardCollection | null>) => void
): Unsubscribe => {
  const unsub = onSnapshot(doc(leaderboardsRef, playlistID), (doc) => {
    if (doc.exists()) {
      const data = doc.data() as LeaderboardCollection;
      setLeaderboard(data);
    } else {
      createLeaderboard(playlistID, playlistName);
    }
  });

  return unsub;
};

export const createLeaderboard = async (
  playlistID: string,
  playlistName: string
): Promise<LeaderboardCollection> => {
  const leaderboardObj: LeaderboardCollection = {
    playlistID: playlistID,
    playlistName: playlistName,
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
  playlistID: string,
  playlistName: string
) => {
  if (leaderboard.top.length === 0) {
    await setDoc(doc(leaderboardsRef, playlistID), {
      playlistID: playlistID,
      playlistName: playlistName,
      top: [newScoreData],
      lastUpdated: new Date(),
      gamesPlayed: leaderboard.gamesPlayed + 1,
    });
  } else {
    // Handle updating scores for the same player

    let containsPlayer = false;
    let playerScore: LeaderboardScores | null = null;

    for (let i = 0; i < leaderboard.top.length; i++) {
      if (leaderboard.top[i].id == newScoreData.id) {
        containsPlayer = true;
        playerScore = leaderboard.top[i];
        break;
      }
    }

    if (containsPlayer && playerScore) {
      const newScore: LeaderboardScores = {
        id: newScoreData.id,
        name: newScoreData.name,
        score:
          playerScore.score > newScoreData.score
            ? playerScore.score
            : newScoreData.score,
        numCorrect:
          playerScore.numCorrect > newScoreData.numCorrect
            ? playerScore.numCorrect
            : newScoreData.numCorrect,
        image: newScoreData.image,
      };

      const newTop = leaderboard.top.filter(
        (score) => score.id != newScoreData.id
      );

      await setDoc(doc(leaderboardsRef, playlistID), {
        playlistID: playlistID,
        playlistName: playlistName,
        top: [...newTop, newScore].sort(
          (a: LeaderboardScores, b: LeaderboardScores) => {
            if (a.score > b.score) {
              return -1;
            }
            if (a.score < b.score) {
              return 1;
            }
            return 0;
          }
        ),
        lastUpdated: new Date(),
        gamesPlayed: leaderboard.gamesPlayed + 1,
      });
    } else {
      await setDoc(doc(leaderboardsRef, playlistID), {
        playlistID: playlistID,
        playlistName: playlistName,
        top: [...leaderboard.top, newScoreData].sort(
          (a: LeaderboardScores, b: LeaderboardScores) => {
            if (a.score > b.score) {
              return -1;
            }
            if (a.score < b.score) {
              return 1;
            }
            return 0;
          }
        ),
        lastUpdated: new Date(),
        gamesPlayed: leaderboard.gamesPlayed + 1,
      });
    }
  }
};
