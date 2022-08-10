import { onAuthStateChanged, User } from "firebase/auth";
import { getDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, userRef } from "../firebase/firebase";
import {
  AccountCollectionDoc,
  UsersSpotifyTokenData,
} from "../models/firebase/account";
import { SpotifyTokenResponse } from "../models/spotify/user";

const authContext = createContext<{
  user: User | null;
  loading: boolean;
  userData: AccountCollectionDoc | null;
}>({
  user: null,
  loading: true,
  userData: null,
});

export const useUser = () => {
  return useContext(authContext);
};

const MILLISECONDS_IN_AN_HOUR = 3600 * 1000; // seconds in an hour * ms in a second

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<AccountCollectionDoc | null>(null);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(userRef, user.uid), (doc) => {
        const data = doc.data() as AccountCollectionDoc;
        setUserData(data);
      });

      return unsub;
    } else {
      setUserData(null);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);

    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsub;
  }, []);

  const refreshTokenData = useCallback(async () => {
    if (userData?.usersSpotifyTokenData?.refreshToken && user) {
      try {
        const req = await fetch(
          "/api/refreshSpotifyToken?refresh_token=" +
            encodeURI(userData.usersSpotifyTokenData.refreshToken)
        );

        const tokenData = await req.json();
        if ("access_token" in tokenData) {
          const tknData = tokenData as SpotifyTokenResponse;
          const spotifyTokenData: UsersSpotifyTokenData = {
            accessToken: tknData.access_token,
            tokenType: tknData.token_type,
            lastRequested: new Date(),
            refreshToken: userData.usersSpotifyTokenData.refreshToken,
            scope: tknData.scope,
          };
          await setDoc(
            doc(userRef, user.uid),
            { usersSpotifyTokenData: spotifyTokenData },
            { merge: true }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [user, userData?.usersSpotifyTokenData?.refreshToken]);

  useEffect(() => {
    refreshTokenData();

    const refresh = setInterval(refreshTokenData, MILLISECONDS_IN_AN_HOUR);

    return () => {
      clearInterval(refresh);
    };
  }, [refreshTokenData]);

  return (
    <authContext.Provider value={{ user, loading, userData }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
