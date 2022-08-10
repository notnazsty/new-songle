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
              slidesPerView: 5,
            },
            1000: {
              slidesPerView: 5,
            },
            780: {
              slidesPerView: 4,
            },
            620: {
              slidesPerView: 3,
            },
            370: {
              slidesPerView: 2,
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
