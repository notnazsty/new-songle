import { userRef } from "../../firebase/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { AccountCollectionDoc } from "models/firebase/account";

export const followPlaylist = async (playlistID: string, userID: string) => {
  const userDataRef = await getDoc(doc(userRef, userID));

  if (userDataRef.exists()) {
    const userData = userDataRef.data() as AccountCollectionDoc;

    const newAccInfo: AccountCollectionDoc = {
      email: userData.email,
      spotifyConnected: userData.spotifyConnected,
      gameWins: userData.gameWins,
      gameLosses: userData.gameLosses,
      totalScore: userData.totalScore,
      id: userData.id,
      spotifyID: userData.spotifyID,
      playlistIDs: [
        ...userData.playlistIDs,
        playlistID.substring(0, playlistID.lastIndexOf("_")),
      ],
      usersSpotifyTokenData: userData.usersSpotifyTokenData,
      spotifyProfileData: userData.spotifyProfileData,
      displayName: userData.displayName,
    };

    setDoc(doc(userRef, userID), newAccInfo);
  }
};

export const unfollowPlaylist = async (playlistID: string, userID: string) => {
  const userDataRef = await getDoc(doc(userRef, userID));

  if (userDataRef.exists()) {
    const userData = userDataRef.data() as AccountCollectionDoc;

    const newAccInfo: AccountCollectionDoc = {
      email: userData.email,
      spotifyConnected: userData.spotifyConnected,
      gameWins: userData.gameWins,
      gameLosses: userData.gameLosses,
      totalScore: userData.totalScore,
      id: userData.id,
      spotifyID: userData.spotifyID,
      playlistIDs: userData.playlistIDs.filter(
        (id) => id != playlistID.substring(0, playlistID.lastIndexOf("_"))
      ),
      usersSpotifyTokenData: userData.usersSpotifyTokenData,
      spotifyProfileData: userData.spotifyProfileData,
      displayName: userData.displayName,
    };

    setDoc(doc(userRef, userID), newAccInfo);
  }
};
