
export enum SongCategory {
  KOREAN = 'Korean',
  INTERNATIONAL = 'International'
}

export interface SongRecommendation {
  title: string;
  artist: string;
  category: SongCategory;
  reason: string;
}

export interface RecommendationResponse {
  recommendations: SongRecommendation[];
}
