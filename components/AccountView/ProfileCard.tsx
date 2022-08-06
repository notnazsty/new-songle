import { Center, Text, Box, useColorModeValue, Avatar, Heading, Stack, Badge, Button, BoxProps } from '@chakra-ui/react';
import React, { useState } from 'react'
import { AccountCollectionDoc } from '../../models/firebase/account';
import { loginURL } from '../../utils/spotify/auth';

interface ProfileCardProps extends BoxProps {
    account: AccountCollectionDoc
}


const ProfileCard: React.FC<ProfileCardProps> = ({ account }) => {

    return (
        <Center py={6}>
            <Box
                maxW={'320px'}
                w={'full'}
                bg={'gray.700'}
                boxShadow={'2xl'}
                rounded={'lg'}
                p={6}
                textAlign={'center'}>
                <Avatar
                    size={'xl'}
                    src={account.spotifyConnected && account.spotifyProfileData? account.spotifyProfileData.images[0].url : "" }
                    mb={4}
                    pos={'relative'}
                    name={account.displayName}

                />
                <Heading fontSize={'2xl'} fontFamily={'body'}>
                    {account.displayName}
                </Heading>
                <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                    <Badge
                        px={2}
                        py={1}
                        bg={'white'}
                        fontWeight={'400'}>
                        {account.gameWins + account.gameLosses + " games played"}
                    </Badge>
                    <Badge
                        px={2}
                        py={1}
                        bg={'white'}
                        fontWeight={'400'}>
                        {account.gameWins + " games won"}
                    </Badge>
                </Stack>

                <Stack mt={8} direction={'row'} spacing={4}>
                    {!account.spotifyConnected ? (
                        <Button
                            colorScheme={'green'}
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            onClick={() => window.open(loginURL, "_self")}
                        >
                            Login to Spotify
                        </Button>
                    ) : 
                    <Button
                        flex={1}
                        fontSize={'sm'}
                        rounded={'full'}
                        bg={'blue.400'}
                        color={'white'}
                        
                        >
                        {account.playlistIDs.length == 0? "Load Playlists" : "Reload Playlists"}
                    </Button>}


                </Stack>
            </Box>
        </Center>
    );
}

export default ProfileCard