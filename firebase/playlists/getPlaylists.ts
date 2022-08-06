import {
  getDoc,
  doc,
  query,
  where,
  DocumentData,
  getDocs,
  QuerySnapshot,
  limit,
} from "firebase/firestore";
import { QueryOperators } from "models/firebase/queries";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";
import { playlistsContRef, playlistsRef } from "../firebase";

export const getFSPlaylistDataFromID = async (
  playlistID: string
): Promise<PlaylistCollectionDoc | void> => {
  let id =
    playlistID.includes("_st0") || playlistID.includes("_0")
      ? playlistID
      : playlistID + "_0";

  const initDoc = await getDoc(doc(playlistsRef, id));

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
          popularity: docData.popularity,
        };
        nextID = nextDocData.nextID;
      } else {
        break;
      }
    }
    return docData;
  }
};

export const getPlaylistsWithWhereQuery = async (
  queryObject: string,
  queryOperator: QueryOperators,
  queryRequirement: any
): Promise<QuerySnapshot<DocumentData>> => {
  const q = query(
    playlistsRef,
    where(queryObject, queryOperator, queryRequirement),
    limit(20)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot;
};
