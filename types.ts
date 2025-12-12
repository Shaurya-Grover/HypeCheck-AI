export type InputType = 'image' | 'video' | 'audio';

export interface PlatformPrediction {
  platformName: string;
  probability: number; // 0-100
}

export interface AttentionDrop {
  timestamp: string;
  reason: string;
  fix: string;
}

export interface VideoAnalysis {
  attention_drops: AttentionDrop[];
  rewritten_hook: string;
}

export interface ViralityResult {
  score: number;
  verdict: "YES" | "NO";
  confidence: number;
  rationale: string;
  top_fixes: string[];
  platform_predictions: PlatformPrediction[]; // Replaces single 'platform' string
  hashtags: string[];
  post_times: string[];
  caption_variants: string[];
  thumbnail_suggestions: string[];
  edit_recipes: string[];
  hook_line: string;
  trend_match: string;
  video_analysis?: VideoAnalysis; // Optional, populated if input is video
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  previewUrl: string | null;
  inputType: InputType;
  caption: string;
  result: ViralityResult;
}

export interface DemoExample {
  id: string;
  title: string;
  type: InputType;
  url: string; // URL for preview
  caption: string;
  trendSnapshot: string;
  result: ViralityResult;
}

export interface AnalysisRequest {
  fileBase64: string;
  mimeType: string;
  caption: string;
  trendSnapshot: string;
  inputType: InputType;
}