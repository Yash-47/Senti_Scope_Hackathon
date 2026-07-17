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
  topicIntelligence?: TopicIntelligence[];
  businessIntelligence?: BusinessIntelligence;
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
  confidence: string;
  evidence: BackendPostDetail[];
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

export interface TopicIntelligence {
  topic: string;
  mentions: number;
  averageSentiment: string;
  dominantEmotion: string;
  averageConfidence: number;
  engagementScore: number;
  priority: string;
}

export interface SupportingMetric {
  label: string;
  value: any;
  unit?: string;
}

export interface EvidencePost {
  author: string;
  text: string;
  url: string;
  sentiment: string;
  emotion: string;
  confidence: number;
}

export interface BackendInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  importanceScore: number;
  confidence: string;
  supportingMetrics: SupportingMetric[];
  evidence: EvidencePost[];
}

export interface RiskAssessment {
  riskLevel: string;
  riskScore: number;
  reason: string;
  supportingMetrics: Record<string, any>;
}

export interface BusinessIntelligence {
  insights: BackendInsight[];
  riskAssessment: RiskAssessment;
}

export interface BackendAnalyzeResponse {
  metadata: ResponseMetadata;
  statistics: BackendStatistics;
  topics: string[];
  topicIntelligence: TopicIntelligence[];
  businessIntelligence: BusinessIntelligence;
  summary: string;
  alerts: BackendAlert[];
  posts: BackendPostDetail[];
  emotionDistribution?: Record<string, number> | null;
}

