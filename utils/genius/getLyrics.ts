import { Song } from "genius-lyrics";
import { GeniusSearchRequestSearchQuery } from "../../models/genius/requests";

export const getSongLyrics = async (
  searchQueryObj: GeniusSearchRequestSearchQuery
): Promise<string> => {
  try {
    let req = await fetch(
      `/api/getGeniusLyrics?query=${encodeURI(
        searchQueryObj.name + " " + searchQueryObj.artists[0]
      )}`
    );

    if (req.status !== 200) {
      return `Error ${req.status}`;
    }

    const data = await req.json();
    const songLyrics = data.lyrics;
    return songLyrics;
  } catch (error) {
    return "";
  }
};

export const getSanitizedString = (lyrics: string): string => {
  const filtered = lyrics
    .split("\n")
    .filter((line) => !line.startsWith("[") && line.trim().length !== 0);
  return filtered.join("\n");
};

// Functions For Optimizing Search Results

export const returnBestMatchSong = (
  songs: Song[],
  searchQuery: string
): Song => {
  if (songs.length === 1) {
    return songs[0];
  }
  let bestSong = songs[0];
  let bestSongWeight = similarity(songs[0].fullTitle, searchQuery);

  for (let i = 1; i < songs.length; i++) {
    const currentWeight = similarity(songs[i].fullTitle, searchQuery);
    if (currentWeight > bestSongWeight) {
      bestSongWeight = currentWeight;
      bestSong = songs[i];
    }
  }
  return bestSong;
};

const similarity = (songOneName: string, songTwoName: string) => {
  let longer: string, shorter: string;

  if (songOneName.length < songTwoName.length) {
    shorter = songOneName;
    longer = songTwoName;
  } else {
    longer = songOneName;
    shorter = songTwoName;
  }

  let maxLen = longer.length;

  if (maxLen === 0) {
    return 1.0;
  }

  return (maxLen - editDistance(longer, shorter)) / maxLen;
};

const editDistance = (s1: string, s2: string) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  let costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};
