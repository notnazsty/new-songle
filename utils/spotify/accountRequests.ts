import axios, { AxiosResponse } from "axios";
import {
  RequestError,
  SpotifyRequestError,
} from "../../models/spotify/requests";
import { SpotifyProfileData } from "../../models/spotify/user";

export const getSpotifyData = async (
  authToken: string
): Promise<SpotifyProfileData | RequestError> => {
  const requestResponse: AxiosResponse<
    SpotifyProfileData | SpotifyRequestError,
    any
  > = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
  });

  if ("error" in requestResponse.data) {
    return {
      status: requestResponse.data.error.status,
      message: requestResponse.data.error.message,
    };
  } else {
    return requestResponse.data;
  }
};
