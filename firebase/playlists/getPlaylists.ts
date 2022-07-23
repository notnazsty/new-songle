import { getDoc, doc } from "firebase/firestore";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";
import { playlistsContRef, playlistsRef } from "../firebase";

export const getFSPlaylistDataFromID = async (
  playlistID: string
): Promise<PlaylistCollectionDoc | void> => {
  const initDoc = await getDoc(doc(playlistsRef, playlistID));

  if (initDoc.exists()) {
    let docData = initDoc.data() as PlaylistCollectionDoc;
    let nextID = docData.nextID || null;

    while (typeof nextID === "string" && nextID) {
      const nextDoc = await getDoc(doc(playlistsContRef, nextID));
      if (nextDoc.exists()) {
        const nextDocData = (await nextDoc.data()) as PlaylistCollectionDoc;
        docData = {
          id: docData.id,
          type: docData.type,
          name: docData.name,
          savedTracks: [...docData.savedTracks, ...nextDocData.savedTracks],
          images: docData.images,
          totalCount: docData.totalCount,
          previousID: nextDocData.nextID,
          nextID: nextDocData.previousID,
          public: docData.public,
        };
        nextID = nextDocData.nextID;
      } else {
        break;
      }
    }
    console.log(docData);
    return docData;
  }
};
