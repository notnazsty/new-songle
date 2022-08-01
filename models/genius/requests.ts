
export interface GeniusLyricObject {
  songLyrics: string;
  displayedLyrics: string;
  hintCount: number;
}

export interface GeniusSearchRequestSearchQuery {
  name: string;
  artists: string[];
}

interface GeniusSearchRequestHitsResults {
  annotation_count: 18;
  api_path: string;
  artist_names: string;
  full_title: string;
  header_image_thumbnail_url: string;
  header_image_url: string;
  id: number;
  lyrics_owner_id: number;
  lyrics_state: string;
  path: string;
  pyongs_count: number;
  relationships_index_url: string;
  release_date_components: {
    year: number;
    month: number;
    day: number;
  };
  release_date_for_display: string;
  song_art_image_thumbnail_url: string;
  song_art_image_url: string;
  stats: {
    unreviewed_annotations: number;
    hot: boolean;
    pageviews: number;
  };
  title: string;
  title_with_featured: string;
  url: string;
  featured_artists: ArtistInfo[];
  primary_artist: ArtistInfo;
}

interface ArtistInfo {
  api_path: string;
  header_image_url: string;
  id: number;
  image_url: string;
  is_meme_verified: boolean;
  is_verified: boolean;
  name: string;
  url: string;
  iq: number;
}

export interface GeniusSearchRequestHit {
  highlights: any[];
  index: string;
  type: string;
  result: GeniusSearchRequestHitsResults;
}

export interface GeniusRequestStatusMeta {
  status: number;
  message: string;
}

export interface AxiosGeniusSearchRequestResponse {
  meta: GeniusRequestStatusMeta;
  response?: {
    hits: GeniusSearchRequestHit[];
  };
}