import type { NextApiRequest, NextApiResponse } from "next";
import { SpotifyTokenResponse } from "../../models/spotify/user";

const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const webURI = process.env.NEXT_PUBLIC_WEB_URI;

//UPDATE TO MAKE IT LOOK NICER

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyTokenResponse | any>
) {
  const code = req.query["code"];

  const authReq = await fetch(
    `https://accounts.spotify.com/api/token?code=${code}&redirect_uri=${encodeURI(
      webURI + "callback/"
    )}&grant_type=authorization_code`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: "Basic " + new Buffer(`${clientID}:${clientSecret}`).toString('base64'),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const respData = (await authReq.json()) as SpotifyTokenResponse;

  res.status(200).json(respData);
}
