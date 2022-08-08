import { Box, Button } from '@chakra-ui/react'
import Navbar from 'components/Layout/Navbar';
import { getDoc, doc } from 'firebase/firestore';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ProfileCard from '../../components/AccountView/ProfileCard';
import { useUser } from '../../components/AuthProvider';
import { userRef } from '../../firebase/firebase';
import { AccountCollectionDoc } from '../../models/firebase/account';

const Account: NextPage = () => {

  const { user } = useUser();
  const [userData, setUserData] = useState<AccountCollectionDoc | null>(null);
  const router = useRouter()


  useEffect(() => {

    if (!userData && user) {

      getDoc(doc(userRef, user.uid)).then((data) => {
        setUserData(data.data() as AccountCollectionDoc)
      })
    }

  }, [user, userData])


  return (
    <Box bg={"black"} color="gray.300" minH="100vh" >
      <Head>
        <title>Account Page</title>
        <meta name="Account Page" content="Account Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar maxWidth="6xl" />



      {userData && (<ProfileCard account={userData} />)}

      {user && userData && (
        <Button colorScheme='green'
          onClick={ () => router.push("/account/initialize")}
        >
          load savedTracks
        </Button>)}


      {/* Users Saved Tracks And Other Info */}
  
    </Box>
  )
}

export default Account