const HOUR_IN_MILLI_SECS = 3600000;
const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const webURI = process.env.NEXT_PUBLIC_WEB_URI;

const authEndpoint = "https://accounts.spotify.com/authorize";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "playlist-read-private",
];

export const loginURL = `${authEndpoint}?response_type=code&client_id=${clientID}&scope=${scopes.join(
  "%20"
)}&redirect_uri=${webURI}callback/`;



// Used To Refresh Access Token Data If Necessary When Making Requests

// export const isAccessTokenValid = (lastRefreshed: Date) => {
//   return (
//     lastRefreshed.getMilliseconds() + HOUR_IN_MILLI_SECS <=
//     new Date().getMilliseconds()
//   );
// };

// export const refreshAccessToken = async (refreshToken: string, userID: string) => {
//   const data = await fetch(
//     "/api/spotifyRefreshToken?refresh_token=" + encodeURI(refreshToken)
//   );
//   const tokenData = (await data.json()) as SpotifyTokenResponse;

//   const userTokenData: UsersSpotifyTokenData = {
//     accessToken: tokenData.access_token,
//     tokenType: tokenData.token_type,
//     lastRequested: new Date(),
//     refreshToken: refreshToken,
//     scope: tokenData.scope,
//   };

//   await setDoc(
//     doc(userRef, userID),
//     { usersSpotifyTokenData: userTokenData },
//     { merge: true }
//   );
// };
