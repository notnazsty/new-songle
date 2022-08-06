import { setDoc, doc } from "firebase/firestore";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";
import { TransformedPlaylistData } from "../../models/spotify/playlists";
import { Song } from "../../models/spotify/songs";
import { playlistsRef, playlistsContRef } from "../firebase";


export const saveUserSavedTracks = async (
  userID: string,
  savedTracks: Song[],
  isPublic: boolean
) => {
  if (savedTracks.length <= 500) {
    const savedTrackDoc: PlaylistCollectionDoc = {
      id: userID + "_st0",
      type: "saved tracks",
      savedTracks: savedTracks,
      totalCount: savedTracks.length,
      previousID: null,
      nextID: null,
      public: isPublic,
      images: null,
      name: "Saved Tracks",
      popularity: 0,
    };

    await setDoc(doc(playlistsRef, savedTrackDoc.id), { ...savedTrackDoc });
  } else {
    const perChunk = 500;
    const chunked = savedTracks.reduce((all: Song[][], one: Song, i) => {
      const chunkIndex = Math.floor(i / perChunk);

      if (!all[chunkIndex]) {
        all[chunkIndex] = []; // start a new chunk
      }

      all[chunkIndex].push(one);

      return all;
    }, []);

    let savedTrackDoc: PlaylistCollectionDoc = {
      id: userID + "_st0",
      type: "saved tracks",
      savedTracks: chunked[0],
      totalCount: savedTracks.length,
      previousID: null,
      nextID: userID + "_st1",
      public: isPublic,
      images: null,
      name: "Saved Tracks",
      popularity: 0,
    };

    await setDoc(doc(playlistsRef, savedTrackDoc.id), { ...savedTrackDoc });

    for (let i = 1; i < chunked.length; i++) {
      savedTrackDoc = {
        id: `${userID}_st${i}`,
        type: "saved tracks",
        savedTracks: chunked[0],
        totalCount: savedTracks.length,
        previousID: `${userID}_st${i - 1}`,
        nextID: i == chunked.length - 1 ? null : `${userID}_st${i + 1}`,
        public: isPublic,
        images: null,
        name: "Saved Tracks",
        popularity: 0,
      };

      await setDoc(doc(playlistsContRef, savedTrackDoc.id), {
        ...savedTrackDoc,
      });
    }
  }
};

export const saveUserPlaylist = async (
  savedTracks: Song[],
  playlistData: TransformedPlaylistData,
  isPublic: boolean
) => {
  if (savedTracks.length <= 500) {
    const savedPlaylistDoc: PlaylistCollectionDoc = {
      id: playlistData.id + "_0",
      type: "playlist",
      savedTracks: savedTracks,
      totalCount: savedTracks.length,
      previousID: null,
      nextID: null,
      public: isPublic,
      images: playlistData.images,
      name: playlistData.name,
      popularity: 0,
    };

    await setDoc(doc(playlistsRef, savedPlaylistDoc.id), {
      ...savedPlaylistDoc,
    });
  } else {
    const perChunk = 500;
    const chunked = savedTracks.reduce((all: Song[][], one: Song, i) => {
      const chunkIndex = Math.floor(i / perChunk);

      if (!all[chunkIndex]) {
        all[chunkIndex] = [];
      }

      all[chunkIndex].push(one);

      return all;
    }, []);

    let savedPlaylistDoc: PlaylistCollectionDoc = {
      id: playlistData.id + "_0",
      type: "playlist",
      savedTracks: chunked[0],
      totalCount: savedTracks.length,
      previousID: null,
      nextID: playlistData.id + "_1",
      public: isPublic,
      images: playlistData.images,
      name: playlistData.name,
      popularity: 0,
    };

    await setDoc(doc(playlistsRef, savedPlaylistDoc.id), {
      ...savedPlaylistDoc,
    });

    for (let i = 1; i < chunked.length; i++) {
      savedPlaylistDoc = {
        id: `${playlistData.id}_${i}`,
        type: "playlist",
        savedTracks: chunked[i],
        totalCount: savedTracks.length,
        previousID: `${playlistData.id}_${i - 1}`,
        nextID: i == chunked.length - 1 ? null : `${playlistData.id}_${i + 1}`,
        public: isPublic,
        images: null,
        name: playlistData.name,
        popularity: 0,
      };

      await setDoc(doc(playlistsContRef, savedPlaylistDoc.id), {
        ...savedPlaylistDoc,
      });
    }
  }
};
