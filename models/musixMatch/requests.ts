export interface GetTracksLyricsRequestProps {
  songName: string;
  artist: string;
}

export type MusixMatchStatusCodes =
  | 200 // The request was successful.
  | 400 // The request had bad syntax or was inherently impossible to be satisfied.
  | 401 // Authentication failed, probably because of invalid/missing API key.
  | 402 // The usage limit has been reached, either you exceeded per day requests limits or your balance is insufficient.
  | 403 // You are not authorized to perform this operation.
  | 404 // The requested resource was not found.
  | 405 // The requested method was not found.
  | 500 // Ops. Something were wrong.
  | 503; //Our system is a bit busy at the moment and your request can’t be satisfied.

export interface MusixMatchHeader {
  status_code: MusixMatchStatusCodes;
  execute_ytime: number;
  available?: number;
}

export interface MatcherLyricsGetResponse {
  message: {
    header: MusixMatchHeader;
  };
  body: {
    lyrics: {
      lyrics_id: number;
      explicit: number;
      lyrics_body: string;
    };
  };
}
