import { SpotifyImageObject } from "../spotify/songs";

export interface PlaylistCollectionDoc {
  id: string; 
  type: "saved tracks" | "playlist"
  name: string;
  savedTracks: Song[];
  images: SpotifyImageObject[] | null;
  totalCount: number;
  previousID: string | null;
  nextID: string | null;
  public: boolean 
}

interface Song {
  name: string;
  album: string;
  artists: string[];
  releaseDate: string;
  coverImages: SpotifyImageObject[];
}




