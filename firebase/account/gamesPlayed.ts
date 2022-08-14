import {  userRef } from "../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { AccountCollectionDoc } from "models/firebase/account";

export const addToGamesPlayed = async (userID: string) => {
  const userDataRef = await getDoc(doc(userRef, userID));
  if (userDataRef.exists()) {
    const userData = userDataRef.data() as AccountCollectionDoc;

    await updateDoc(doc(userRef, userID), {
      gamesPlayed: userData.gamesPlayed + 1,
    });
  }
};
