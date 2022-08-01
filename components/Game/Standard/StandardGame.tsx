import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { getRandomLyrics, shuffle } from "../../../utils/game/standard/methods";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Song } from "../../../models/spotify/songs";
import { getSongLyrics } from "../../../utils/genius/getLyrics";
import SongOptions from "./SongOptions";
import Timer from "./Timer";
import SongCard from "../SongCard";

interface StandardGameProps {
  songList: Song[];
  setSongList: Dispatch<SetStateAction<Song[] | null>>;
  setGameMode: Dispatch<SetStateAction<"Base" | "Standard" | "Casual">>;
}

const StandardGame: React.FC<StandardGameProps> = ({
  songList,
  setSongList,
  setGameMode,
}) => {
  const [lyrics, setLyrics] = useState<string[] | null>();
  const [correctSong, setCorrectSong] = useState<Song | null>(null);
  const [options, setOptions] = useState<Song[] | null>(null);
  const [songListStack, setSongListStack] = useState<Song[]>(shuffle(songList));
  const [loaded, setLoaded] = useState(false);

  const [gameState, setGameState] = useState<"In Progress" | "Loss" | "Win">(
    "In Progress"
  );

  const [isLyricLoaded, setIsLyricLoaded] = useState(false);

  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(15 * 1000); // 15 Seconds
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [score, setScore] = useState(0);

  const loadNextRound = useCallback(() => {
    setIsLyricLoaded(false);
    const correctOption = songListStack[songListStack.length - 1];
    setCorrectSong(correctOption);

    const randOpts: Song[] = [];

    while (randOpts.length < 3) {
      const randSong = songList[Math.floor(Math.random() * songList.length)];
      if (randSong.name != correctOption.name) {
        randOpts.push(randSong);
      }
    }
    setOptions(shuffle([correctOption, ...randOpts]));
    console.log([correctSong, ...randOpts]);
    getSongLyrics({
      name: correctOption.name,
      artists: correctOption.artists,
    }).then((lyric) => {
      setLyrics(getRandomLyrics(lyric));
      setIsLyricLoaded(true);
    });
  }, [correctSong, songList, songListStack]);

  const outOfTimeUpdate = useCallback(() => {
    if (wrongAnswers < 2) {
      setWrongAnswers((wrongAnswers) => wrongAnswers + 1);
      loadNextRound();
    } else if (wrongAnswers < 3) {
      setWrongAnswers((wrongAnswers) => wrongAnswers + 1);
      setGameState("Loss");
    }
  }, [loadNextRound, wrongAnswers]);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;

    if (isLyricLoaded) {
      setTimeLeft(maxTime);
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft > 100) {
            return timeLeft - 100;
          } else {
            outOfTimeUpdate();
            if (interval) {
              clearInterval(interval);
            }
            return 0;
          }
        });
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLyricLoaded, loadNextRound, maxTime, outOfTimeUpdate]);

  useEffect(() => {
    if (!loaded) {
      const correctSongIndex = songListStack.length - 1;
      setCorrectSong(songListStack[correctSongIndex]);

      const randOpts: Song[] = [];

      while (
        randOpts.length < 3 &&
        randOpts.length < songListStack.length - 1
      ) {
        const randIndex = Math.floor(Math.random() * songListStack.length);
        if (randIndex !== songListStack.length - 1) {
          randOpts.push(songListStack[randIndex]);
        }
      }
      setOptions(shuffle([songListStack[correctSongIndex], ...randOpts]));
      console.log([correctSong, ...randOpts]);
      getSongLyrics({
        name: songListStack[correctSongIndex].name,
        artists: songListStack[correctSongIndex].artists,
      }).then((lyric) => {
        setLyrics(getRandomLyrics(lyric));
        setIsLyricLoaded(true);
      });

      setLoaded(true);
    }
  }, [correctSong, loaded, songListStack]);

  useEffect(() => {
    console.log(correctSong);
  }, [correctSong]);

  const updateCounts = () => {
    setNumberCorrect(numberCorrect + 1);
    const newScore = score + -1 * (timeLeft - maxTime) * 0.05 + 50;
    setScore(newScore);
    if (numberCorrect % 5 == 0 && numberCorrect !== 0 && maxTime > 5000) {
      setMaxTime(maxTime - 2500);
    }
  };

  const handleGuess = (guess: Song) => {
    if (
      correctSong &&
      guess.album === correctSong.album &&
      correctSong.name === guess.name &&
      guess.artists == correctSong.artists &&
      correctSong.releaseDate == guess.releaseDate
    ) {
      songListStack.pop();
      const newStack = Array.from(songListStack);
      setSongListStack(newStack);
      console.log("new stack", newStack);

      updateCounts();

      if (songListStack.length == 0) {
        setGameState("Win");
      } else {
        loadNextRound();
      }
    } else {
      if (wrongAnswers < 2) {
        setWrongAnswers(wrongAnswers + 1);
      } else {
        setWrongAnswers(wrongAnswers + 1);
        setGameState("Loss");
      }
    }
  };

  const startNewGame = () => {
    setSongListStack(shuffle(songList));
    setWrongAnswers(0);
    setGameState("In Progress");
    setScore(0);
    setMaxTime(15 * 1000);
    setNumberCorrect(0);
    loadNextRound();
  };

  return (
    <Box>
      {correctSong && options && lyrics ? (
        <>
          {gameState == "In Progress" ? (
            <>
              <HStack justifyContent={"space-around"} mx={4}>
                <Timer timeLeft={timeLeft} />

                <Text color="green" fontSize="4xl">
                  {score}
                </Text>

                <HStack w="100%" justifyContent={"right"}>
                  {new Array(3 - wrongAnswers).fill("_").map((val, i) => (
                    <Text fontSize="3xl" color="red" key={i}>
                      x
                    </Text>
                  ))}
                </HStack>
              </HStack>
              {isLyricLoaded ? (
                <VStack spacing={2} mt={4} mb={8} color="white">
                  {lyrics.map((line, i) => (
                    <Text key={i} fontStyle={"bold"} fontSize={"xl"}>
                      {line}
                    </Text>
                  ))}{" "}
                </VStack>
              ) : (
                <Spinner color="orange" size="xl">
                  {" "}
                </Spinner>
              )}

              <SongOptions options={options} handleGuess={handleGuess} />
            </>
          ) : gameState == "Win" ? (
            <>
              <Heading> Win </Heading>
              <HStack w="100%">
                <Button color="green" onClick={() => startNewGame()}>
                  Play Again
                </Button>
                <Button color="red" onClick={() => setGameMode("Base")}>
                  Back
                </Button>
              </HStack>
            </>
          ) : (
            <VStack w='100%' justifyContent={'center'} spacing={8}>
              <Heading color='red' mt={4}> Loss </Heading>

              <Text fontSize={'2xl'}> Score: {score} </Text>

              <VStack>
                <Text fontSize={'2xl'} fontWeight='bold'> Correct Song </Text>
                <Image
                  src={correctSong.coverImages[0].url}
                  alt={correctSong.name}
                  boxSize="sm"
                />
                <Text> {correctSong.name} </Text>
              </VStack>
              <HStack w="100%" justifyContent={'center'} >
                <Button colorScheme="green" onClick={() => startNewGame()}>
                  Play Again
                </Button>
                <Button colorScheme="red" onClick={() => setGameMode("Base")}>
                  Back
                </Button>
              </HStack>
            </VStack>
          )}
        </>
      ) : (
        <Spinner color="orange" size="xl" />
      )}
    </Box>
  );
};

export default StandardGame;