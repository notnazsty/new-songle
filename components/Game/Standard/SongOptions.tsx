import { Box, Grid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Song } from "../../../models/spotify/songs";
import SongCard from "../SongCard";

interface SongOptionsProps {
  options: Song[];
  handleGuess: (guess: Song) => void;
}

const SongOptions: React.FC<SongOptionsProps> = ({ options, handleGuess }) => {
  const colors = ["red.700", "blue.600", "yellow.600", "green.600"];

  return (
    <Grid templateRows={{md: "1fr 1fr"}} templateColumns={{md: "1fr 1fr"}} p={4} gridGap={6}>
      {options.map((song, i) => (
        <Box key={i} onClick={() => handleGuess(song)}>
          <SongCard bg={colors[i % 4]} key={i} song={song} />
        </Box>
      ))}
    </Grid>
  );
};

export default SongOptions;
