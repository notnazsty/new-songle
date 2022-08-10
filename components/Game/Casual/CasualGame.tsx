import {
  Image,
  Grid,
  Stack,
  VStack,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { SongSimilarity } from "models/methods";
import { Song } from "models/spotify/songs";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import areArraysEqual, {
  filterSongOptions,
  songSimilarities,
} from "utils/game/methods";
import CasualGrid from "./CasualGrid";
import GameInfo from "./GameInfo";

interface CasualGameProps {
  songList: Song[];
  setGameMode: Dispatch<SetStateAction<"Base" | "Standard" | "Casual">>;
}

const CasualGame: React.FC<CasualGameProps> = ({ songList, setGameMode }) => {
  const [innerSongList, setInnerSongList] = useState(songList);
  const [loading, setLoading] = useState(true);
  const [correctSong, setCorrectSong] = useState<Song | null>(null);
  const [songsGuessed, setSongsGuessed] = useState<Song[]>([]);
  const [numOfGuesses, setNumOfGuesses] = useState(0);
  const [hint, setHint] = useState<SongSimilarity | null>(null);
  const [gameState, setGameState] = useState<"Playing" | "Win" | "Loss">(
    "Playing"
  );
  const [isLyricLoaded, setIsLyricLoaded] = useState(false);

  // TODO Filter Song Options with Guesses

  useEffect(() => {
    if (loading) {
      setCorrectSong(
        innerSongList[Math.floor(Math.random() * innerSongList.length)]
      );
      setLoading(false);
    }
  }, [innerSongList, loading]);

  const handleGuess = (guess: Song) => {
    if (correctSong) {
      if (
        guess.name === correctSong.name &&
        guess.album === correctSong.album &&
        areArraysEqual(guess.artists, correctSong.artists, false)
      ) {
        setGameState("Win");
      } else {
        if (numOfGuesses == 5) {
          setGameState("Loss");
        }
        setSongsGuessed([...songsGuessed, guess]);
        setNumOfGuesses((num) => num + 1);
        const filteredSongOptions = filterSongOptions(
          guess,
          correctSong,
          innerSongList
        );
        setInnerSongList(filteredSongOptions);
        const hint = correctSong ? songSimilarities(guess, correctSong) : null;
        setHint(hint);
      }
    }
  };

  const startNewGame = () => {
    setGameState("Playing");
    setInnerSongList(songList);
    setIsLyricLoaded(false);

    setCorrectSong(
      innerSongList[Math.floor(Math.random() * innerSongList.length)]
    );
    setNumOfGuesses(0);
    setSongsGuessed([]);
    setHint(null);
  };

  return (
    <Grid templateColumns={{ lg: "300px 1fr" }} gridGap={12} px={4} py={2}>
      {correctSong && (
        <GameInfo
          correctSong={correctSong}
          songsGuessed={songsGuessed}
          numOfGuesses={numOfGuesses}
          isLyricLoaded={isLyricLoaded}
          setIsLyricLoaded={setIsLyricLoaded}
          hint={hint}
        />
      )}

      <VStack align="stretch" spacing={6}>
        {gameState == "Playing" && (
          <>
            <Stack
              w="100%"
              direction={{ base: "column", lg: "row" }}
              align={{ base: "start", lg: "center" }}
              justify={{ lg: "space-between" }}
            >
              <Text
                flexShrink={0}
                mt={0}
                fontSize={"4xl"}
                fontWeight="bold"
                lineHeight={{ lg: 0 }}
              >
                Make a Guess!
              </Text>
            </Stack>
            <CasualGrid songList={innerSongList} handleGuess={handleGuess} />
          </>
        )}
        {gameState == "Win" && correctSong && (
          <VStack w="100%" justifyContent={"center"}>
            <Text fontSize={"4xl"} fontWeight="bold">
              You Won!!
            </Text>
            <Image
              src={correctSong.coverImages[0].url}
              alt={correctSong.name}
              boxSize="sm"
            />
            <Text> {correctSong.name} </Text>

            <HStack w="100%" justifyContent={"center"}>
              <Button colorScheme="green" onClick={() => startNewGame()}>
                Play Again
              </Button>
              <Button colorScheme="red" onClick={() => setGameMode("Base")}>
                Back
              </Button>
            </HStack>
          </VStack>
        )}
        {gameState == "Loss" && correctSong && (
          <VStack w="100%" justifyContent={"center"}>
            <Text fontSize={"4xl"} fontWeight="bold">
              Correct Song
            </Text>
            <Image
              src={correctSong.coverImages[0].url}
              alt={correctSong.name}
              boxSize="sm"
            />
            <Text> {correctSong.name} </Text>

            <HStack w="100%" justifyContent={"center"}>
              <Button colorScheme="green" onClick={() => startNewGame()}>
                Play Again
              </Button>
              <Button colorScheme="red" onClick={() => setGameMode("Base")}>
                Back
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </Grid>
  );
};

export default CasualGame;
