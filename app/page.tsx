"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/search/SearchBar";
import StatCard from "../components/cards/StatCard";
import SentimentPieChart from "../components/charts/SentimentPieChart";
import EmotionBarChart from "../components/charts/EmotionBarChart";
import TrendingTopicsChart from "../components/charts/TrendingTopicsChart";
import InsightsCard from "../components/dashboard/InsightsCard";
import AlertsCard from "../components/dashboard/AlertsCard";
import RootCauseCard from "../components/dashboard/RootCauseCard";
import PostsTable from "../components/dashboard/PostsTable";
import LoadingDashboard from "../components/dashboard/LoadingDashboard";
import { analyzeKeyword } from "../lib/api";
import { SentimentReport, StatMetric, SentimentDataPoint, TrendingTopicPoint, BackendAlert, BackendPostDetail } from "../types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<SentimentReport | null>(null);
  const [topic, setTopic] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (isLoading && trimmed === activeSearch) return; // Prevent duplicate active requests

    setIsLoading(true);
    setError(null);
    setActiveSearch(trimmed);
    setTopic(trimmed);

    try {
      const data = await analyzeKeyword(trimmed);

      if (!data.posts || data.posts.length === 0) {
        setError("No matching posts were found.");
        setReport(null);
        return;
      }

      // Map statistics
      const total = data.statistics.totalPosts;
      const positivePercent = data.statistics.positivePercent;
      const neutralPercent = data.statistics.neutralPercent;
      const negativePercent = data.statistics.negativePercent;

      const mappedMetrics: StatMetric[] = [
        {
          title: "Total Posts Analyzed",
          value: total ?? 0,
          change: "from live stream",
          trend: "neutral",
          type: "posts",
        },
        {
          title: "Positive Sentiment",
          value: `${Math.round(positivePercent)}%`,
          change: "from live stream",
          trend: "neutral",
          type: "positive",
        },
        {
          title: "Negative Sentiment",
          value: `${Math.round(negativePercent)}%`,
          change: "from live stream",
          trend: "neutral",
          type: "negative",
        },
        {
          title: "Neutral Sentiment",
          value: `${Math.round(neutralPercent)}%`,
          change: "from live stream",
          trend: "neutral",
          type: "neutral",
        },
        {
          title: "Average Likes",
          value: data.statistics.averageLikes !== null && data.statistics.averageLikes !== undefined
            ? Math.round(data.statistics.averageLikes)
            : "N/A",
          change: "per post average",
          trend: "neutral",
          type: "likes",
        },
        {
          title: "Most Active Author",
          value: data.statistics.mostActiveAuthor || "N/A",
          change: "highest post volume",
          trend: "neutral",
          type: "author",
        },
      ];

      // Map sentiment pie chart
      const sentimentDistribution: SentimentDataPoint[] = [
        { name: "Positive", value: Math.round(positivePercent), color: "#10b981" },
        { name: "Negative", value: Math.round(negativePercent), color: "#f43f5e" },
        { name: "Neutral", value: Math.round(neutralPercent), color: "#6b7280" },
      ];

      // Map emotion distribution
      const emotionAnalysis = data.emotionDistribution
        ? Object.keys(data.emotionDistribution).map((emo) => ({
            emotion: emo,
            percentage: data.emotionDistribution![emo],
          }))
        : null;

      // Map trending subtopics based on post occurrences
      const trendingTopics: TrendingTopicPoint[] = data.topics.map((t) => {
        const postsWithTopic = data.posts.filter((post) =>
          (post.text || "").toLowerCase().includes(t.toLowerCase())
        );
        const count = postsWithTopic.length;
        const positiveCount = postsWithTopic.filter(
          (post) => (post.sentiment || "").toLowerCase() === "positive"
        ).length;
        const sentimentScore = count > 0 ? Math.round((positiveCount / count) * 100) : 50;

        return {
          topic: t,
          count,
          sentimentScore,
        };
      });

      setReport({
        topic: trimmed,
        timestamp: data.metadata.timestamp || new Date().toISOString(),
        metrics: mappedMetrics,
        sentimentDistribution,
        emotionAnalysis: emotionAnalysis || [],
        trendingTopics,
        insights: {
          summary: data.summary,
          recommendation: "",
        },
        alerts: data.alerts,
        rootCause: null, // Hide root cause analysis
        posts: data.posts,
        topics: data.topics,
        emotionDistribution: data.emotionDistribution,
      });

    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      console.error("API error details:", err);
      const msg = err instanceof Error ? err.message : "Analysis failed.";
      setError(msg);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Navigation Header */}
      <Header />

      {/* Top Banner Background Effect */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center py-10">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Section */}
          <motion.div
            layout
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className={`flex flex-col text-center space-y-6 ${
              report ? "mt-4" : "mt-12 sm:mt-24"
            }`}
          >
            {!report && (
              <div className="space-y-4">
                <span className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Real-Time Social Listening Engine</span>
                </span>
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-[1.1]">
                  Real-Time Social Media{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Intelligence
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed">
                  Monitor public sentiment, detect emerging trends, identify root causes, and generate AI-powered insights from live social media discussions.
                </p>
              </div>
            )}

            {/* Sticky Search Panel when reports exist */}
            <div className="w-full">
              {report && (
                <div className="flex items-center justify-between max-w-3xl mx-auto mb-4 px-4 text-left">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Search Topic</span>
                  <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">#{topic.toLowerCase()}</span>
                </div>
              )}
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </motion.div>

          {/* Core Dashboard View */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center space-y-4 rounded-2xl border border-rose-500/10 bg-rose-500/5 p-6 backdrop-blur-sm"
              >
                <div className="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-rose-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Search Problem</h3>
                  <p className="text-sm text-gray-405 max-w-md">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            {isLoading && !report && (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingDashboard />
              </motion.div>
            )}

            {!isLoading && !report && !error && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-4"
              >
                <div className="h-16 w-16 rounded-2xl bg-card border border-card-border flex items-center justify-center shadow-lg shadow-black/20">
                  <Sparkles className="h-7 w-7 text-indigo-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No query analyzed yet</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Enter a brand, keyword, or stock ticker in the bar above to compile public sentiment trends in real-time.
                  </p>
                </div>
              </motion.div>
            )}

            {report && (
              <div className="relative">
                {/* Semi-transparent loading overlay for subsequent searches */}
                {isLoading && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-[2px] transition-all duration-300">
                    <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl border border-indigo-500/10 bg-card/85 shadow-2xl shadow-black/40">
                      <div className="h-10 w-10 border-4 border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
                      <p className="text-sm font-semibold text-indigo-400 animate-pulse">Refreshing analysis...</p>
                    </div>
                  </div>
                )}

                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-8"
                >
                  {/* Meta details header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-5">
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-white flex items-center">
                        Report Overview:{" "}
                        <span className="text-indigo-400 ml-2 bg-indigo-500/5 px-2.5 py-0.5 rounded border border-indigo-500/15">
                          {report.topic}
                        </span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        Analysis updated at {new Date(report.timestamp).toLocaleString()} &middot; Powered by SentiScope AI
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-400 bg-card/60 rounded-xl border border-card-border px-3.5 py-2">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span>Signal Strength: <strong className="text-white font-bold">Strong</strong></span>
                    </div>
                  </div>

                  {/* Extracted Topics Chips Row */}
                  <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                      Extracted Topics & Themes
                    </h3>
                    {report.topics && report.topics.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {report.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-xs text-indigo-400 font-semibold"
                          >
                            #{t.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No topics extracted.</p>
                    )}
                  </div>

                  {/* 1. Statistics Row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {report.metrics.map((metric, index) => (
                      <StatCard key={index} {...metric} />
                    ))}
                  </div>

                  {/* 2. Charts Row 1: Pie & Vertical Bar */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <SentimentPieChart data={report.sentimentDistribution} />
                    <EmotionBarChart data={report.emotionAnalysis} />
                  </div>

                  {/* 3. Charts Row 2: Trending Subtopics */}
                  <TrendingTopicsChart data={report.trendingTopics} />

                  {/* 4. AI Insights and Detected Alerts */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <InsightsCard insights={report.insights} />
                    <AlertsCard alerts={report.alerts as BackendAlert[]} />
                  </div>

                  {/* 5. Root Cause Column Grid (hidden gracefully since backend support is unavailable) */}
                  {report.rootCause && (
                    <RootCauseCard rootCause={report.rootCause} />
                  )}

                  {/* 6. Raw posts table */}
                  <PostsTable posts={report.posts as BackendPostDetail[]} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
