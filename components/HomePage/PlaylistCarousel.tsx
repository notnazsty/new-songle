import { HStack, Text, VStack } from "@chakra-ui/react";
import { PlaylistCollectionDoc } from "models/firebase/playlists";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistCard from "./PlaylistCard";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination} from "swiper";

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
    
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={4}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          {playlists.map((playlist: PlaylistCollectionDoc) => (
            <SwiperSlide key={playlist.id} >
              <PlaylistCard playlist={playlist} />
            </SwiperSlide>
          ))}
        </Swiper>
      </HStack>
    </VStack>
  );
};

export default PlaylistCarousel;
