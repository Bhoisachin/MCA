
export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export interface CommentAnalysis {
  id: number;
  originalComment: string;
  stakeholderType?: string;
  sentiment: Sentiment;
  summary: string;
  themes: string[];
}

export interface AnalysisResult {
  comments: CommentAnalysis[];
  overallThemes: { theme: string; count: number }[];
}
