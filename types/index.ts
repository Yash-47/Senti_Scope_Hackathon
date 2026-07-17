export interface StatMetric {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  type: "posts" | "positive" | "negative" | "neutral" | "likes" | "author";
}

export interface SentimentDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface EmotionDataPoint {
  emotion: string;
  percentage: number;
}

export interface TrendingTopicPoint {
  topic: string;
  count: number;
  sentimentScore: number; // 0 to 100
}

export interface SocialMediaAlert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  type: "negative" | "trending" | "positive";
}

export interface RootCauseItem {
  aspect: string;
  percentage: number;
  description: string;
  votes: number;
}

export interface RootCauseAnalysis {
  praises: RootCauseItem[];
  complaints: RootCauseItem[];
}

export interface SocialPost {
  id: string;
  title: string;
  subreddit: string;
  score: number;
  sentiment: "positive" | "negative" | "neutral";
  emotion: "joy" | "anger" | "fear" | "sadness" | "surprise";
  date: string;
  url: string;
}

export interface AIInsights {
  summary: string;
  recommendation: string;
}

export interface SentimentReport {
  topic: string;
  timestamp: string;
  metrics: StatMetric[];
  sentimentDistribution: SentimentDataPoint[];
  emotionAnalysis: EmotionDataPoint[];
  trendingTopics: TrendingTopicPoint[];
  insights: AIInsights;
  alerts: BackendAlert[] | SocialMediaAlert[];
  rootCause: RootCauseAnalysis | null;
  posts: BackendPostDetail[] | SocialPost[];
  topics?: string[];
  emotionDistribution?: Record<string, number> | null;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: string;
  processingTime: string;
  source: string;
  keyword: string;
  cached: boolean;
}

export interface BackendStatistics {
  totalPosts: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  averageComments: number;
  averageScore?: number | null;
  mostActiveSubreddit?: string | null;
  averageLikes?: number | null;
  mostActiveAuthor?: string | null;
}

export interface BackendAlert {
  type: string;
  priority: string;
  title: string;
  description: string;
}

export interface BackendPostDetail {
  text: string;
  sentiment: string;
  confidence: number;
  emotion: string;
  subreddit: string;
  author: string;
  score: number;
  comments: number;
  date: string;
  postUrl: string;
}

export interface BackendAnalyzeResponse {
  metadata: ResponseMetadata;
  statistics: BackendStatistics;
  topics: string[];
  summary: string;
  alerts: BackendAlert[];
  posts: BackendPostDetail[];
  emotionDistribution?: Record<string, number> | null;
}

