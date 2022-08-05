import { SongSimilarity } from "models/methods";
import { Song } from "models/spotify/songs";

export const shuffle = <T>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

export const getRandomLyrics = (lyrics: string): string[] => {
  const lyricsArr = lyrics.split("\n");

  if (lyricsArr.length >= 4) {
    let randomIndex = Math.floor(Math.random() * lyricsArr.length);
    while (!(randomIndex + 4 <= lyricsArr.length)) {
      randomIndex = Math.floor(Math.random() * lyricsArr.length);
    }
    return lyricsArr.slice(randomIndex, randomIndex + 4);
  }

  return lyricsArr;
};

export default function areArraysEqual(a: any[] | null, b: any[] | null, orderMatters = false) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  if (!orderMatters) {
    a = a.sort()
    b = b.sort()
  }

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function intersect<T>(a: T[], b: T[]) {
  var setB = new Set(b);
  return [...Array.from(new Set(a))].filter((x) => setB.has(x));
}

export const songSimilarities: (a: Song, b: Song) => SongSimilarity = (
  a,
  b
) => {
  const name = intersect(a.name.split(" ").map((val) => val.trim().toLowerCase()), b.name.split(" ").map((val) => val.trim().toLowerCase()));
  const album = intersect(a.album.split(" ").map((val) => val.trim().toLowerCase()), b.album.split(" ").map((val) => val.trim().toLowerCase()));
  const artists = intersect(a.artists.map((val) => val.trim()), b.artists.map((val) => val.trim()));

  return {
    name,
    album,
    artists,
  };
};

export const filterSongOptions : (guess: Song, correctSong: Song | null, songOptions: Song[]) => Song[] = (guess, correctSong, songOptions) => {
    
  if (!correctSong) {
      return songOptions;
  }

  const similarities = songSimilarities(guess, correctSong);

  return songOptions.filter((val) => {
      for (let i = 0; i < similarities.name.length; i++) {
          const word = similarities.name[i];
         if (!val.name.toLowerCase().includes(word)) {
          return false;
         }
      }

      for (let i = 0; i < similarities.album.length; i++) {
          const word = similarities.album[i];
         if (!val.album.toLowerCase().includes(word)) {
          return false;
         }
      }

      for (let i = 0; i < similarities.artists.length; i++) {
          const artist = similarities.artists[i];
         if (!val.artists.includes(artist)) {
          return false;
         }
      }
      
      return true;
  })
}


