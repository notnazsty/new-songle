import { Box, Grid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Song } from "../../../models/spotify/songs";
import SongCard from "../SongCard";

interface SongOptionsProps {
  options: Song[];
  handleGuess: (guess: Song) => void;
}

const SongOptions: React.FC<SongOptionsProps> = ({ options, handleGuess }) => {
  return (
    <Grid templateRows={"1fr 1fr"} templateColumns={"1fr 1fr"} mx={16} >
      {options.map((song, i) => (
        <Box key={i} onClick={() => handleGuess(song)} mx={8} my={4}>
          <SongCard key={i} song={song} />
        </Box>
      ))}
    </Grid>
  );
};

export default SongOptions;
