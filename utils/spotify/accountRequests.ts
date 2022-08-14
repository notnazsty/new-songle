import axios, { AxiosError, AxiosResponse } from "axios";
import {
  RequestError,
  SpotifyRequestError,
} from "../../models/spotify/requests";
import { SpotifyProfileData } from "../../models/spotify/user";

export const getSpotifyData = async (
  authToken: string
): Promise<SpotifyProfileData | RequestError> => {
  try {
    const requestResponse: AxiosResponse<SpotifyProfileData, any> =
      await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      });

    return requestResponse.data;
  } catch (err: any) {
    return {
      status: err.response.status,
      message: err.response.data,
    };
  }
};
