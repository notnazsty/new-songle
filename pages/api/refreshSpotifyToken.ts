import type { NextApiRequest, NextApiResponse } from "next";
import { SpotifyTokenResponse } from "../../models/spotify/user";

const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyTokenResponse | any>
) {
  const refresh_token = req.query["refresh_token"];

  const authReq = await fetch(
    `https://accounts.spotify.com/api/token?refresh_token=${refresh_token}&grant_type=refresh_token`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization:
          "Basic " +
          new Buffer(`${clientID}:${clientSecret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const respData = (await authReq.json()) as SpotifyTokenResponse;

  res.status(200).json(respData);
}
