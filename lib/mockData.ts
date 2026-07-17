import { SentimentReport } from "../types";

// Helper to format dates relative to current time
const getPastDateString = (hoursAgo: number): string => {
  const date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MOCK_TESLA: SentimentReport = {
  topic: "Tesla",
  timestamp: new Date().toISOString(),
  metrics: [
    { title: "Total Posts Analyzed", value: "3,842", change: "+14.2% vs yesterday", trend: "up", type: "posts" },
    { title: "Positive Sentiment", value: "68%", change: "+2.1% from last week", trend: "up", type: "positive" },
    { title: "Negative Sentiment", value: "22%", change: "+4.5% after update", trend: "down", type: "negative" },
    { title: "Neutral Sentiment", value: "10%", change: "-6.6% from last week", trend: "neutral", type: "neutral" },
  ],
  sentimentDistribution: [
    { name: "Positive", value: 68, color: "#10b981" },
    { name: "Negative", value: 22, color: "#f43f5e" },
    { name: "Neutral", value: 10, color: "#6b7280" },
  ],
  emotionAnalysis: [
    { emotion: "Joy", percentage: 48 },
    { emotion: "Anger", percentage: 18 },
    { emotion: "Fear", percentage: 8 },
    { emotion: "Sadness", percentage: 12 },
    { emotion: "Surprise", percentage: 14 },
  ],
  trendingTopics: [
    { topic: "Autopilot FSD", count: 824, sentimentScore: 78 },
    { topic: "Battery Degradation", count: 412, sentimentScore: 32 },
    { topic: "Cabin Heating", count: 350, sentimentScore: 18 },
    { topic: "Build Quality", count: 289, sentimentScore: 45 },
    { topic: "Price Cuts", count: 215, sentimentScore: 68 },
    { topic: "Supercharger Network", count: 189, sentimentScore: 92 },
  ],
  insights: {
    summary: "Public sentiment is largely positive regarding the Autopilot FSD improvements and Supercharger accessibility. However, recent discussions indicate a sharp spike in complaints regarding cabin heating failures and battery thermal warning alerts after the v12.4 software update. Overall discussion volume has increased by 14% over the last 24 hours.",
    recommendation: "Thermal management and firmware engineering teams should immediately audit the v12.4 software update's heater controls. PR and marketing should prioritize highlighting the safety and expansion of the Supercharging network."
  },
  alerts: [
    {
      id: "t1",
      title: "Battery Discussion Surge",
      description: "Discussion about battery thermal limits increased by 140% in r/teslamotors.",
      timestamp: "10 mins ago",
      priority: "high",
      type: "negative"
    },
    {
      id: "t2",
      title: "FSD v12 Praise Trending",
      description: "Positive sentiment around Autopilot v12 reaches a 30-day high of 78%.",
      timestamp: "1 hour ago",
      priority: "medium",
      type: "positive"
    },
    {
      id: "t3",
      title: "Heating Issue Growing Rapidly",
      description: "Over 80 posts reporting cabin pre-heating failure on cold mornings.",
      timestamp: "2 hours ago",
      priority: "high",
      type: "negative"
    }
  ],
  rootCause: {
    praises: [
      { aspect: "FSD Autopilot", percentage: 82, description: "Smooth lane changes and roundabouts handling.", votes: 412 },
      { aspect: "Supercharger Speed", percentage: 76, description: "V4 chargers opening up more spots.", votes: 320 },
      { aspect: "Infotainment UI", percentage: 70, description: "Fluid navigation interface and game support.", votes: 245 },
      { aspect: "Acceleration", percentage: 91, description: "Incredible instant torque feedback.", votes: 508 },
    ],
    complaints: [
      { aspect: "Battery Heating", percentage: 65, description: "Pre-conditioning taking twice as long.", votes: 310 },
      { aspect: "Software Bugs", percentage: 58, description: "Screen freezes after update v12.4.", votes: 240 },
      { aspect: "Panel Gaps", percentage: 42, description: "Uneven alignment on trunk and side windows.", votes: 190 },
      { aspect: "Phantom Braking", percentage: 48, description: "Sudden slowing down on highways under shadows.", votes: 215 },
    ]
  },
  posts: [
    { id: "tp1", title: "FSD v12 is actually mindblowing, drove 40 miles today zero interventions", subreddit: "r/teslamotors", score: 980, sentiment: "positive", emotion: "joy", date: getPastDateString(1), url: "#" },
    { id: "tp2", title: "WARNING: Cabin pre-conditioning is failing after the latest OTA update", subreddit: "r/TeslaModel3", score: 822, sentiment: "negative", emotion: "anger", date: getPastDateString(2), url: "#" },
    { id: "tp3", title: "Took delivery of my Model Y, panel gaps are perfect this time!", subreddit: "r/teslamotors", score: 650, sentiment: "positive", emotion: "joy", date: getPastDateString(3), url: "#" },
    { id: "tp4", title: "Phantom braking is still a major issue. Scared my wife on the highway.", subreddit: "r/TeslaModelY", score: 541, sentiment: "negative", emotion: "fear", date: getPastDateString(4), url: "#" },
    { id: "tp5", title: "What is your battery degradation after 50k miles? Mine is 8%.", subreddit: "r/teslamotors", score: 412, sentiment: "neutral", emotion: "sadness", date: getPastDateString(6), url: "#" },
    { id: "tp6", title: "Tesla opens up 20 more Superchargers to non-Tesla EVs in my state", subreddit: "r/electricvehicles", score: 380, sentiment: "positive", emotion: "surprise", date: getPastDateString(8), url: "#" },
    { id: "tp7", title: "Is it just me, or did charging speed drop on V3 Superchargers lately?", subreddit: "r/TeslaModel3", score: 290, sentiment: "negative", emotion: "sadness", date: getPastDateString(10), url: "#" },
    { id: "tp8", title: "New OTA UI updates look super sleek. Loving the fullscreen visualization.", subreddit: "r/teslamotors", score: 244, sentiment: "positive", emotion: "joy", date: getPastDateString(12), url: "#" },
    { id: "tp9", title: "Autopilot tried to merge into a concrete barrier today. Stay alert guys.", subreddit: "r/TeslaModelY", score: 210, sentiment: "negative", emotion: "fear", date: getPastDateString(14), url: "#" },
    { id: "tp10", title: "Comparing Tesla insurance rates. Why is it so expensive in California?", subreddit: "r/teslamotors", score: 185, sentiment: "neutral", emotion: "surprise", date: getPastDateString(16), url: "#" },
    { id: "tp11", title: "Sentry mode is draining 5% battery per day now. Highly inefficient.", subreddit: "r/TeslaModel3", score: 160, sentiment: "negative", emotion: "anger", date: getPastDateString(18), url: "#" },
    { id: "tp12", title: "Love the panoramic glass roof but man it gets hot in summer", subreddit: "r/TeslaModelY", score: 145, sentiment: "neutral", emotion: "sadness", date: getPastDateString(20), url: "#" },
    { id: "tp13", title: "Custom horn noises are back in this update! Hilarious", subreddit: "r/teslamotors", score: 130, sentiment: "positive", emotion: "joy", date: getPastDateString(22), url: "#" },
    { id: "tp14", title: "Service center scratched my wheels during rotation, refusing to fix it", subreddit: "r/teslamotors", score: 112, sentiment: "negative", emotion: "anger", date: getPastDateString(24), url: "#" },
    { id: "tp15", title: "Just crossed 100k miles on original brake pads. Regenerative braking is king.", subreddit: "r/electricvehicles", score: 98, sentiment: "positive", emotion: "joy", date: getPastDateString(26), url: "#" }
  ]
};

const MOCK_CHATGPT: SentimentReport = {
  topic: "ChatGPT",
  timestamp: new Date().toISOString(),
  metrics: [
    { title: "Total Posts Analyzed", value: "7,491", change: "+22.8% vs yesterday", trend: "up", type: "posts" },
    { title: "Positive Sentiment", value: "76%", change: "+5.3% from last week", trend: "up", type: "positive" },
    { title: "Negative Sentiment", value: "14%", change: "-2.1% from last week", trend: "up", type: "negative" },
    { title: "Neutral Sentiment", value: "10%", change: "-3.2% from last week", trend: "neutral", type: "neutral" },
  ],
  sentimentDistribution: [
    { name: "Positive", value: 76, color: "#10b981" },
    { name: "Negative", value: 14, color: "#f43f5e" },
    { name: "Neutral", value: 10, color: "#6b7280" },
  ],
  emotionAnalysis: [
    { emotion: "Joy", percentage: 56 },
    { emotion: "Anger", percentage: 8 },
    { emotion: "Fear", percentage: 10 },
    { emotion: "Sadness", percentage: 6 },
    { emotion: "Surprise", percentage: 20 },
  ],
  trendingTopics: [
    { topic: "o1 Reasoning Model", count: 1820, sentimentScore: 84 },
    { topic: "Coding Assistance", count: 950, sentimentScore: 88 },
    { topic: "Hallucinations", count: 480, sentimentScore: 28 },
    { topic: "Rate Limits", count: 420, sentimentScore: 15 },
    { topic: "Subscription Cost", count: 310, sentimentScore: 50 },
    { topic: "Voice Mode", count: 290, sentimentScore: 78 },
  ],
  insights: {
    summary: "Public reception is highly enthusiastic about the advanced reasoning and code generation capabilities of the o1 model series. The primary negative drivers are OpenAI's strict rate limits for Plus users and occasional hallucination loops in mathematical problems. Sentiment has reached near-all-time highs.",
    recommendation: "Product teams should work on expanding rate-limit quotas for developer-tier accounts. Marketing should emphasize 'coding co-pilot' benefits and launch interactive benchmarks displaying reduced hallucinations."
  },
  alerts: [
    {
      id: "c1",
      title: "Rate Limit Complaints Surge",
      description: "Posts regarding 'ChatGPT o1 rate limits reached' increased by 200%.",
      timestamp: "5 mins ago",
      priority: "high",
      type: "negative"
    },
    {
      id: "c2",
      title: "Code Generation Praise",
      description: "Developer feedback about code refactoring speed is 92% positive.",
      timestamp: "45 mins ago",
      priority: "low",
      type: "positive"
    },
    {
      id: "c3",
      title: "API Server Outage Reported",
      description: "Subreddit thread tracking '503 Server Error' gains 400 upvotes.",
      timestamp: "3 hours ago",
      priority: "medium",
      type: "negative"
    }
  ],
  rootCause: {
    praises: [
      { aspect: "Logical Reasoning", percentage: 88, description: "Stunning logic step breakdown and math solving.", votes: 720 },
      { aspect: "Code Refactoring", percentage: 91, description: "Generates production-ready TypeScript code structures.", votes: 640 },
      { aspect: "Voice Mode Fluidity", percentage: 80, description: "Highly realistic inflection and quick response times.", votes: 450 },
      { aspect: "Memory Feature", percentage: 72, description: "Conveniently remembers coding frameworks across sessions.", votes: 310 },
    ],
    complaints: [
      { aspect: "Strict Rate Limits", percentage: 78, description: "o1-preview is limited to only 30 messages per week.", votes: 580 },
      { aspect: "AI Hallucinations", percentage: 48, description: "Invents fictional package library links in code outputs.", votes: 290 },
      { aspect: "Search API Speed", percentage: 38, description: "Web search mode takes up to 15 seconds to fetch sources.", votes: 140 },
      { aspect: "Pricing", percentage: 44, description: "$20/month is heavy for casual users without o1-pro access.", votes: 190 },
    ]
  },
  posts: [
    { id: "cp1", title: "ChatGPT o1 just refactored my entire 1000-line legacy react code in 10 seconds", subreddit: "r/ChatGPT", score: 2450, sentiment: "positive", emotion: "joy", date: getPastDateString(1), url: "#" },
    { id: "cp2", title: "OpenAI, please increase the o1 rate limits. 30 messages is unusable for work", subreddit: "r/openai", score: 1822, sentiment: "negative", emotion: "anger", date: getPastDateString(2), url: "#" },
    { id: "cp3", title: "Is anyone else getting constant 503 errors when calling the API today?", subreddit: "r/ChatGPTCoders", score: 980, sentiment: "negative", emotion: "fear", date: getPastDateString(3), url: "#" },
    { id: "cp4", title: "o1 solved a math puzzle that stumped my CS professor. Absolutely wild.", subreddit: "r/ChatGPT", score: 870, sentiment: "positive", emotion: "surprise", date: getPastDateString(4), url: "#" },
    { id: "cp5", title: "Advanced Voice Mode had an entire fluid conversation with my 4yo in Spanish", subreddit: "r/openai", score: 710, sentiment: "positive", emotion: "joy", date: getPastDateString(6), url: "#" },
    { id: "cp6", title: "Caution: o1 hallucinated an entire library to solve a React state issue", subreddit: "r/javascript", score: 620, sentiment: "negative", emotion: "sadness", date: getPastDateString(8), url: "#" },
    { id: "cp7", title: "Is ChatGPT Plus still worth it with the current limits?", subreddit: "r/ChatGPT", score: 450, sentiment: "neutral", emotion: "surprise", date: getPastDateString(10), url: "#" },
    { id: "cp8", title: "Using custom instructions to make GPT respond like a terminal. Super helpful.", subreddit: "r/ChatGPT", score: 320, sentiment: "positive", emotion: "joy", date: getPastDateString(12), url: "#" },
    { id: "cp9", title: "GPT-4o output speed has doubled. The latency is practically gone.", subreddit: "r/openai", score: 290, sentiment: "positive", emotion: "joy", date: getPastDateString(14), url: "#" },
    { id: "cp10", title: "I built a fully functional chrome extension using only chatgpt prompts", subreddit: "r/webdev", score: 260, sentiment: "positive", emotion: "joy", date: getPastDateString(16), url: "#" },
    { id: "cp11", title: "The web browsing tool is so slow today. Just spins on 'searching' forever.", subreddit: "r/ChatGPT", score: 195, sentiment: "negative", emotion: "sadness", date: getPastDateString(18), url: "#" },
    { id: "cp12", title: "Will AI replace software developers in 3 years? Reddit debate.", subreddit: "r/technology", score: 180, sentiment: "neutral", emotion: "fear", date: getPastDateString(20), url: "#" },
    { id: "cp13", title: "ChatGPT remembers my dog's name and my react preferences. Cute feature.", subreddit: "r/ChatGPT", score: 150, sentiment: "positive", emotion: "joy", date: getPastDateString(22), url: "#" },
    { id: "cp14", title: "My custom GPT is leaking system prompts. Be careful what instructions you write.", subreddit: "r/openai", score: 120, sentiment: "negative", emotion: "fear", date: getPastDateString(24), url: "#" },
    { id: "cp15", title: "Anyone else feel like GPT-4o has been writing lower quality responses lately?", subreddit: "r/ChatGPT", score: 95, sentiment: "neutral", emotion: "sadness", date: getPastDateString(26), url: "#" }
  ]
};

const MOCK_SAMSUNG: SentimentReport = {
  topic: "Samsung",
  timestamp: new Date().toISOString(),
  metrics: [
    { title: "Total Posts Analyzed", value: "2,984", change: "+8.5% vs yesterday", trend: "up", type: "posts" },
    { title: "Positive Sentiment", value: "71%", change: "+3.4% from last week", trend: "up", type: "positive" },
    { title: "Negative Sentiment", value: "19%", change: "+1.2% from last week", trend: "neutral", type: "negative" },
    { title: "Neutral Sentiment", value: "10%", change: "-4.6% from last week", trend: "down", type: "neutral" },
  ],
  sentimentDistribution: [
    { name: "Positive", value: 71, color: "#10b981" },
    { name: "Negative", value: 19, color: "#f43f5e" },
    { name: "Neutral", value: 10, color: "#6b7280" },
  ],
  emotionAnalysis: [
    { emotion: "Joy", percentage: 46 },
    { emotion: "Anger", percentage: 14 },
    { emotion: "Fear", percentage: 6 },
    { emotion: "Sadness", percentage: 10 },
    { emotion: "Surprise", percentage: 24 },
  ],
  trendingTopics: [
    { topic: "Dynamic AMOLED Screen", count: 910, sentimentScore: 89 },
    { topic: "200MP Camera Zoom", count: 750, sentimentScore: 92 },
    { topic: "Hinge Durability", count: 320, sentimentScore: 61 },
    { topic: "Exynos vs Snapdragon", count: 290, sentimentScore: 40 },
    { topic: "One UI Bloatware", count: 210, sentimentScore: 28 },
    { topic: "Charging Speed", count: 180, sentimentScore: 35 },
  ],
  insights: {
    summary: "Public conversations focus heavily on display performance and ultra-zoom camera capability. However, concerns persist around charging speed limits compared to Chinese brands, and the Exynos processor efficiency in European models. Overall engagement is solid, driven by recent flagship releases.",
    recommendation: "Development teams should focus on matching competitors' 80W+ charging thresholds. European marketing should counter efficiency complaints by presenting certified battery tests showcasing Exynos battery lifespan."
  },
  alerts: [
    {
      id: "s1",
      title: "Exynos Throttling Threads",
      description: "Thermal throttling and lag complaints on Exynos variants in r/Android.",
      timestamp: "15 mins ago",
      priority: "medium",
      type: "negative"
    },
    {
      id: "s2",
      title: "OLED Screen Praise",
      description: "Dynamic AMOLED display ratings rank 96% positive in technical forums.",
      timestamp: "2 hours ago",
      priority: "low",
      type: "positive"
    },
    {
      id: "s3",
      title: "Hinge Durability Discussion",
      description: "Users debating Fold6 dust ingress risks after sandbox stress tests.",
      timestamp: "4 hours ago",
      priority: "medium",
      type: "negative"
    }
  ],
  rootCause: {
    praises: [
      { aspect: "Display Brightness", percentage: 94, description: "Superb outdoor visibility under direct sunlight.", votes: 410 },
      { aspect: "Camera Zoom", percentage: 89, description: "Clear Moon shots and 100x stability assistance.", votes: 350 },
      { aspect: "S-Pen Integration", percentage: 82, description: "Highly responsive handwriting and air gestures.", votes: 210 },
      { aspect: "One UI Customization", percentage: 76, description: "Deep lockscreen styling and Good Lock support.", votes: 190 },
    ],
    complaints: [
      { aspect: "Slow Charging", percentage: 68, description: "Stuck at 45W while rivals provide 100W+ charging.", votes: 290 },
      { aspect: "Exynos Battery Drain", percentage: 54, description: "5G standby drains battery 15% faster than Snapdragon.", votes: 215 },
      { aspect: "Software Bloat", percentage: 48, description: "Duplicated apps (Samsung Messages + Google Messages).", votes: 160 },
      { aspect: "High Pricing", percentage: 38, description: "Foldable prices remain out of reach for general consumers.", votes: 110 },
    ]
  },
  posts: [
    { id: "sp1", title: "The display on the Galaxy S24 Ultra is unreal. Anti-reflective glass is a game changer", subreddit: "r/galaxyS24ultra", score: 1450, sentiment: "positive", emotion: "joy", date: getPastDateString(1), url: "#" },
    { id: "sp2", title: "Why is Samsung still capping charging speed at 45W? It takes over an hour to charge", subreddit: "r/Android", score: 890, sentiment: "negative", emotion: "anger", date: getPastDateString(2), url: "#" },
    { id: "sp3", title: "Galaxy Fold 6 screen cracked right along the hinge after only two weeks of light use", subreddit: "r/GalaxyFold", score: 720, sentiment: "negative", emotion: "sadness", date: getPastDateString(3), url: "#" },
    { id: "sp4", title: "Shot this video from the back row of a concert using the 100x zoom. Quality is insane!", subreddit: "r/samsung", score: 680, sentiment: "positive", emotion: "surprise", date: getPastDateString(5), url: "#" },
    { id: "sp5", title: "Exynos 2400 is overheating and throttling heavily while playing Genshin Impact", subreddit: "r/Android", score: 540, sentiment: "negative", emotion: "anger", date: getPastDateString(7), url: "#" },
    { id: "sp6", title: "Samsung Messages is officially deprecated in favor of Google Messages. Good move.", subreddit: "r/samsung", score: 430, sentiment: "positive", emotion: "joy", date: getPastDateString(9), url: "#" },
    { id: "sp7", title: "Is anyone else experiencing paint peeling on the Fold 6 frame? Extremely disappointing", subreddit: "r/GalaxyFold", score: 390, sentiment: "negative", emotion: "sadness", date: getPastDateString(11), url: "#" },
    { id: "sp8", title: "Samsung's One UI 6.1 animations are so much smoother. Feels like iOS now.", subreddit: "r/samsung", score: 310, sentiment: "positive", emotion: "joy", date: getPastDateString(13), url: "#" },
    { id: "sp9", title: "Wait, the AI live translate actually works? Just tried it on a call to Japan.", subreddit: "r/samsung", score: 280, sentiment: "positive", emotion: "surprise", date: getPastDateString(15), url: "#" },
    { id: "sp10", title: "Samsung customer service refused to replace my screen under warranty. Unbelievable.", subreddit: "r/samsung", score: 210, sentiment: "negative", emotion: "anger", date: getPastDateString(17), url: "#" },
    { id: "sp11", title: "Battery life comparison: Snapdragon vs Exynos Galaxy S24. 1 hour screen-on-time difference.", subreddit: "r/technology", score: 195, sentiment: "neutral", emotion: "sadness", date: getPastDateString(19), url: "#" },
    { id: "sp12", title: "Good Lock modules are updated. You can now fully customize the taskbar.", subreddit: "r/samsung", score: 170, sentiment: "positive", emotion: "joy", date: getPastDateString(21), url: "#" },
    { id: "sp13", title: "Fold 6 crease is barely noticeable this time. Big step up from my Fold 4.", subreddit: "r/GalaxyFold", score: 145, sentiment: "positive", emotion: "surprise", date: getPastDateString(23), url: "#" },
    { id: "sp14", title: "Can we talk about how awful the speaker quality is on the S24? Sounds tinny.", subreddit: "r/galaxyS24ultra", score: 110, sentiment: "negative", emotion: "sadness", date: getPastDateString(25), url: "#" },
    { id: "sp15", title: "Just set up Dex mode on my monitor. It's basically a chromebook replacement.", subreddit: "r/samsung", score: 95, sentiment: "positive", emotion: "joy", date: getPastDateString(27), url: "#" }
  ]
};

const MOCK_DEFAULT = (topic: string): SentimentReport => {
  const normalized = topic.trim() || "Search Query";
  return {
    topic: normalized,
    timestamp: new Date().toISOString(),
    metrics: [
      { title: "Total Posts Analyzed", value: "1,248", change: "+5.1% since yesterday", trend: "up", type: "posts" },
      { title: "Positive Sentiment", value: "54%", change: "+1.2% from last week", trend: "up", type: "positive" },
      { title: "Negative Sentiment", value: "32%", change: "+3.6% from last week", trend: "down", type: "negative" },
      { title: "Neutral Sentiment", value: "14%", change: "-2.8% from last week", trend: "neutral", type: "neutral" },
    ],
    sentimentDistribution: [
      { name: "Positive", value: 54, color: "#10b981" },
      { name: "Negative", value: 32, color: "#f43f5e" },
      { name: "Neutral", value: 14, color: "#6b7280" },
    ],
    emotionAnalysis: [
      { emotion: "Joy", percentage: 38 },
      { emotion: "Anger", percentage: 22 },
      { emotion: "Fear", percentage: 12 },
      { emotion: "Sadness", percentage: 18 },
      { emotion: "Surprise", percentage: 10 },
    ],
    trendingTopics: [
      { topic: "Product Design", count: 480, sentimentScore: 72 },
      { topic: "Pricing Model", count: 320, sentimentScore: 48 },
      { topic: "Customer Service", count: 290, sentimentScore: 24 },
      { topic: "Software Updates", count: 210, sentimentScore: 55 },
      { topic: "Feature Performance", count: 180, sentimentScore: 68 },
      { topic: "Hardware Specs", count: 110, sentimentScore: 60 },
    ],
    insights: {
      summary: `Public discussions surrounding "${normalized}" show balanced interest. Positive sentiment highlights core product features and aesthetic design. Criticism focuses on pricing and support delays, with moderate concerns regarding recent software updates. Overall engagement remains stable.`,
      recommendation: `Target customer support bottlenecks and clarify pricing models. Emphasize functional updates and product stability to reassure the community.`
    },
    alerts: [
      {
        id: "d1",
        title: "Price Criticism Rising",
        description: "Negative discussions regarding cost-efficiency increased by 45%.",
        timestamp: "30 mins ago",
        priority: "medium",
        type: "negative"
      },
      {
        id: "d2",
        title: "Feature Praise Viral",
        description: "A review thread detailing new features has hit the popular section.",
        timestamp: "3 hours ago",
        priority: "low",
        type: "positive"
      },
      {
        id: "d3",
        title: "Software Bug Reports",
        description: "Increase in crash logs reported by users on mobile platforms.",
        timestamp: "5 hours ago",
        priority: "medium",
        type: "negative"
      }
    ],
    rootCause: {
      praises: [
        { aspect: "Product Design", percentage: 72, description: "Aesthetics look modern and appeal to younger users.", votes: 180 },
        { aspect: "Feature Set", percentage: 68, description: "Wide range of integrations and productivity options.", votes: 154 },
        { aspect: "Hardware build", percentage: 61, description: "Sturdy chassis and premium build feel.", votes: 98 },
        { aspect: "User Experience", percentage: 70, description: "Smooth onboarding flow and fast startup.", votes: 140 },
      ],
      complaints: [
        { aspect: "Customer Support", percentage: 58, description: "Ticket wait times average over 48 hours.", votes: 120 },
        { aspect: "Cost-to-Value", percentage: 52, description: "Subscription tier feels pricey for the utility provided.", votes: 104 },
        { aspect: "Minor Bugs", percentage: 46, description: "Random app closure when performing background tasks.", votes: 88 },
        { aspect: "Setup Difficulty", percentage: 34, description: "Confusing initial configurations for beginner users.", votes: 55 },
      ]
    },
    posts: [
      { id: "dp1", title: `Loving the new features of ${normalized}, makes my workflow so much faster`, subreddit: "r/productivity", score: 450, sentiment: "positive", emotion: "joy", date: getPastDateString(2), url: "#" },
      { id: "dp2", title: `Is anyone else having issues getting a response from ${normalized} support?`, subreddit: "r/help", score: 320, sentiment: "negative", emotion: "anger", date: getPastDateString(4), url: "#" },
      { id: "dp3", title: `The new price increase for ${normalized} is complete highway robbery`, subreddit: "r/technology", score: 280, sentiment: "negative", emotion: "anger", date: getPastDateString(6), url: "#" },
      { id: "dp4", title: `Highly impressed with the build quality of my new ${normalized}. Worth every penny`, subreddit: "r/hardware", score: 210, sentiment: "positive", emotion: "joy", date: getPastDateString(8), url: "#" },
      { id: "dp5", title: `${normalized} app is crashing constantly on Android since the morning update`, subreddit: "r/help", score: 195, sentiment: "negative", emotion: "sadness", date: getPastDateString(10), url: "#" },
      { id: "dp6", title: `Useful guide on how to integrate ${normalized} API with python in under 5 mins`, subreddit: "r/programming", score: 160, sentiment: "positive", emotion: "joy", date: getPastDateString(12), url: "#" },
      { id: "dp7", title: `Honestly, ${normalized} is just average. Doesn't blow me away but works.`, subreddit: "r/reviews", score: 145, sentiment: "neutral", emotion: "sadness", date: getPastDateString(14), url: "#" },
      { id: "dp8", title: `A quick security concern: is ${normalized} sharing user telemetry by default?`, subreddit: "r/privacy", score: 120, sentiment: "negative", emotion: "fear", date: getPastDateString(16), url: "#" },
      { id: "dp9", title: `I just received a free replacement for my broken ${normalized}! Support came through.`, subreddit: "r/help", score: 98, sentiment: "positive", emotion: "surprise", date: getPastDateString(18), url: "#" },
      { id: "dp10", title: `Why does ${normalized} require internet connection to run local commands?`, subreddit: "r/software", score: 85, sentiment: "neutral", emotion: "surprise", date: getPastDateString(20), url: "#" },
      { id: "dp11", title: `The loading spinner is getting annoying. Seems slower than last version.`, subreddit: "r/technology", score: 74, sentiment: "negative", emotion: "sadness", date: getPastDateString(22), url: "#" },
      { id: "dp12", title: `My team just transitioned to ${normalized}. A few thoughts.`, subreddit: "r/business", score: 62, sentiment: "neutral", emotion: "joy", date: getPastDateString(24), url: "#" },
      { id: "dp13", title: `Absolutely hate the new font choice in ${normalized}'s update. Hard to read.`, subreddit: "r/design", score: 55, sentiment: "negative", emotion: "anger", date: getPastDateString(26), url: "#" },
      { id: "dp14", title: `Stellar documentation page. Other companies should copy ${normalized}.`, subreddit: "r/webdev", score: 48, sentiment: "positive", emotion: "joy", date: getPastDateString(28), url: "#" },
      { id: "dp15", title: `Is there any open source alternative to ${normalized} that you recommend?`, subreddit: "r/opensource", score: 32, sentiment: "neutral", emotion: "fear", date: getPastDateString(30), url: "#" }
    ]
  };
};

export const fetchSentimentData = (topic: string): Promise<SentimentReport> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const query = topic.trim().toLowerCase();
      if (query === "tesla") {
        resolve(MOCK_TESLA);
      } else if (query === "chatgpt" || query === "chat gpt" || query === "openai") {
        resolve(MOCK_CHATGPT);
      } else if (query === "samsung" || query === "galaxy") {
        resolve(MOCK_SAMSUNG);
      } else {
        // Generate dynamic fallback mock report for the given query
        resolve(MOCK_DEFAULT(topic));
      }
    }, 2000);
  });
};
