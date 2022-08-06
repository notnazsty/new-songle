import { signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { AccountCollectionDoc } from "../models/firebase/account";
import { auth, authProvider, userRef } from "./firebase";


export const signin = async () => {
  try {
    const { user } = await signInWithPopup(auth, authProvider);

    const getDocRef = await getDoc(doc(userRef, user.uid));

    if (getDocRef.exists()) {
      return;
    } 

    const newAccInfo: AccountCollectionDoc = {
      email: user.email,
      spotifyConnected: false,
      gameWins: 0,
      gameLosses: 0,
      totalScore: 0,
      id: user.uid,
      spotifyID: null,
      playlistIDs: [],
      usersSpotifyTokenData: null,
      spotifyProfileData: null,
      displayName: user.displayName? user.displayName : "Anonymous"
    };

    setDoc(doc(userRef, user.uid), newAccInfo);
  } catch (error) {
    console.log(error);
  }
};
