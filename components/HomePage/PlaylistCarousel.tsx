import { Center, HStack, Text, VStack } from "@chakra-ui/react";
import { PlaylistCollectionDoc } from "models/firebase/playlists";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistCard from "./PlaylistCard";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper";

interface PlaylistCarouselProps {
  name: string;
  playlists: PlaylistCollectionDoc[];
}

const PlaylistCarousel: React.FC<PlaylistCarouselProps> = ({
  name,
  playlists,
}) => {
  return (
    <VStack w="100%" maxW="6xl" p={4} justifyContent={"left"} alignItems="left">
      <Text fontSize="2xl"> {name} </Text>
      <HStack w="100%">
        <Swiper
          breakpoints={{
            1280: {
              slidesPerView: playlists.length <5? playlists.length : 5,
            },
            780: {
              slidesPerView: playlists.length <4? playlists.length : 4,
            },
            620: {
              slidesPerView: playlists.length <3? playlists.length : 3,
            },
            370: {
              slidesPerView: playlists.length <2? playlists.length : 2,
            },
          }}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={50}
        >
          {playlists.map((playlist: PlaylistCollectionDoc) => (
            <SwiperSlide key={playlist.id}>
              <PlaylistCard playlist={playlist} />
            </SwiperSlide>
          ))}
        </Swiper>
      </HStack>
      {playlists.length == 0 && <Text> no playlists to display..</Text>}
    </VStack>
  );
};

export default PlaylistCarousel;
