import { Grid, HStack, VStack } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Song } from '../../models/spotify/songs';
import Searchbar from './Searchbar';
import SongPreview from './SongPreview';

interface SongGridProps {
    savedTracks: Song[]
}

const SongGrid: React.FC<SongGridProps> = ({
    savedTracks
}) => {

    const [songList, setSongList] = useState<Song[]>([])

    return (
        <VStack w='100%' justifyContent={'left'}>

            <Searchbar songs={savedTracks} setSongList={setSongList} />

            <Grid w="100%" templateColumns={{ md: "repeat(1, 1fr)", xl: "repeat(6, 1fr)" }} gridGap={4}>
                {songList.map((song, i) => <SongPreview key={i} song={song} />)}
            </Grid>
        </VStack>
    )
}

export default SongGrid