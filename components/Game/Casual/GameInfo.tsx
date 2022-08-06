import { CloseIcon } from "@chakra-ui/icons";
import { Center, Divider, Grid, Spinner, Text, VStack } from "@chakra-ui/react";
import { SongSimilarity } from "models/methods";
import { Song } from "models/spotify/songs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getRandomLyrics } from "utils/game/methods";
import { getSongLyrics } from "utils/genius/getLyrics";

interface GameInfoProps {
  correctSong: Song;
  songsGuessed: Song[];
  numOfGuesses: number;
  isLyricLoaded: boolean;
  setIsLyricLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  hint: SongSimilarity | null;
}

const GameInfo: React.FC<GameInfoProps> = ({
  correctSong,
  songsGuessed,
  numOfGuesses,
  isLyricLoaded,
  setIsLyricLoaded,
  hint,
}) => {
  const MAX_GUESSES = 6;

  const [songLyrics, setSongLyrics] = useState<string[] | null>(null);

  const updateLyrics = useCallback(async () => {
    if (!isLyricLoaded) {
      const lyrics = await getSongLyrics({
        name: correctSong.name,
        artists: correctSong.artists,
      });
      setIsLyricLoaded(true);
      setSongLyrics(getRandomLyrics(lyrics));
    }
  }, [correctSong, isLyricLoaded, setIsLyricLoaded]);

  useEffect(() => {
    updateLyrics();
  }, [updateLyrics]);

  const guessBgColor = (i: number, numOfSongsGuessed: number) => {
    if (i < numOfSongsGuessed) {
      return "red.700";
    } else {
      return "gray.800";
    }
  };

  return (
    <VStack align={"stretch"} spacing={6}>
      <VStack align={"start"}>
        <Grid w="100%" maxW="300px" templateColumns={"repeat(6, 1fr)"}>
          {Array.from({ length: MAX_GUESSES }, (val, i) => (
            <Center
              key={i}
              boxSize={10}
              rounded="md"
              bg={guessBgColor(i, numOfGuesses)}
              borderWidth="1px"
              borderColor={i == numOfGuesses ? "blue.500" : "gray.800"}
            >
              {i < numOfGuesses && <CloseIcon boxSize={3} />}
            </Center>
          ))}
        </Grid>
        <Text fontSize="md" color="gray.400">{`${
          MAX_GUESSES - numOfGuesses
        } guesses remaining`}</Text>
      </VStack>
      <VStack align={"start"} spacing={4}>
        {!isLyricLoaded && (
          <Center w="100%">
            <Spinner size="md" color="orange" thickness="3px" />
          </Center>
        )}

        {songLyrics && isLyricLoaded && (
          <VStack align={"start"} w="100%" justifyContent="space-between">
            {songLyrics.map((line, i) => (
              <Text
                textAlign={"left"}
                key={i}
                fontStyle={"bold"}
                fontSize={"md"}
              >
                {line}
              </Text>
            ))}
          </VStack>
        )}

        {songLyrics && isLyricLoaded && <Divider />}

        <Text color="gray.300">
          Hints based on the similarities between your guesses and the correct
          answer will appear here.
        </Text>

        <Text fontWeight={"bold"}>Hints</Text>

        {hint && hint.name.length > 0 && (
          <VStack>
            <Text>Name: {hint.name.join(", ")}</Text>
          </VStack>
        )}
        {hint && hint.album.length > 0 && (
          <VStack>
            <Text>Album: {hint.album.join(", ")}</Text>
          </VStack>
        )}
        {hint && hint.artists.length > 0 && (
          <VStack>
            <Text>Artists: {hint.artists.join(", ")}</Text>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default GameInfo;
