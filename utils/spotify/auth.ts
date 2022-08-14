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
