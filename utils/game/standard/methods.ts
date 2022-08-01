export const shuffle = <T>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

export const getRandomLyrics = (lyrics: string): string[] => {
  const lyricsArr = lyrics.split("\n");
  console.log(lyricsArr);

  if (lyricsArr.length >= 4) {
    let randomIndex = Math.floor(Math.random() * lyricsArr.length);
    while (!(randomIndex + 4 <= lyricsArr.length)) {
      randomIndex = Math.floor(Math.random() * lyricsArr.length);
    }
    return lyricsArr.slice(randomIndex, randomIndex + 4);
  }

  return lyricsArr;
};


