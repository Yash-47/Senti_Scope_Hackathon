"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import MobileDrawer from "../components/layout/MobileDrawer";
import FloatingBottomNav from "../components/layout/FloatingBottomNav";
import HeroSection from "../components/dashboard/HeroSection";
import StatCard from "../components/cards/StatCard";
import DiscussionHealthCard from "../components/dashboard/DiscussionHealthCard";
import BusinessInsightsSection from "../components/dashboard/BusinessInsightsSection";
import ExecutiveSummaryCard from "../components/dashboard/ExecutiveSummaryCard";
import AlertCard from "../components/dashboard/AlertCard";
import TopicIntelligenceSection from "../components/dashboard/TopicIntelligenceSection";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import PostsFeed from "../components/dashboard/PostsFeed";
import LoadingDashboard from "../components/dashboard/LoadingDashboard";
import { analyzeKeyword } from "../lib/api";
import { SentimentReport, StatMetric, SentimentDataPoint, TrendingTopicPoint, BackendAlert, BackendPostDetail } from "../types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<SentimentReport | null>(null);
  const [topic, setTopic] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          title: "Total Posts",
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
          title: "Most Active",
          value: data.statistics.mostActiveAuthor || "N/A",
          change: "highest post volume",
          trend: "neutral",
          type: "author",
        },
      ];

      // Map sentiment pie chart
      const sentimentDistribution: SentimentDataPoint[] = [
        { name: "Positive", value: Math.round(positivePercent), color: "#006847" },
        { name: "Negative", value: Math.round(negativePercent), color: "#b90014" },
        { name: "Neutral", value: Math.round(neutralPercent), color: "#565e74" },
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
        topicIntelligence: data.topicIntelligence,
        businessIntelligence: data.businessIntelligence,
        insights: {
          summary: data.summary,
          recommendation: "",
        },
        alerts: data.alerts,
        rootCause: null,
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
    <div className="min-h-screen bg-background font-sans text-on-background overflow-x-hidden flex">
      {/* 1. Desktop Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. Overlay Mobile Menu Drawer */}
      <MobileDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 3. Right Shell Content Wrapper */}
      <div className="flex-grow flex flex-col min-h-screen md:pl-64 transition-all">
        {/* TopNavBar header */}
        <Navbar
          onSearch={handleSearch}
          isLoading={isLoading}
          onToggleMenu={() => setIsMenuOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-20 pb-24 px-4 md:px-8 max-w-[1600px] w-full mx-auto space-y-8">
          {/* Hero Intro section containing desktop branding & mobile search inputs */}
          <HeroSection
            onSearch={handleSearch}
            isLoading={isLoading}
            activeQuery={topic}
          />

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
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-on-surface">Search Problem</h3>
                  <p className="text-xs text-on-surface-variant/80 max-w-md font-semibold">
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
                <div className="h-16 w-16 rounded-2xl bg-card border border-card-border/40 flex items-center justify-center shadow-lg shadow-black/5">
                  <Sparkles className="h-7 w-7 text-primary animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-on-surface">No topic analyzed yet</h3>
                  <p className="text-xs text-on-surface-variant/80 max-w-sm font-semibold leading-relaxed">
                    Enter a brand name, keyword, or social tag in the search inputs above to evaluate public listening feeds.
                  </p>
                </div>
              </motion.div>
            )}

            {report && (
              <div className="relative">
                {/* Refresh loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-[2px] transition-all duration-300">
                    <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl border border-primary/10 bg-card/85 shadow-2xl shadow-black/40">
                      <div className="h-10 w-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                      <p className="text-xs font-bold text-primary animate-pulse">Refreshing analysis...</p>
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
                  {/* Active report subheader */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border/40 pb-5">
                    <div>
                      <h2 className="font-display text-xl font-extrabold tracking-tight text-on-surface flex items-center">
                        Report Overview:{" "}
                        <span className="text-primary ml-2 bg-primary/5 px-2.5 py-0.5 rounded border border-primary/15">
                          {report.topic}
                        </span>
                      </h2>
                      <p className="text-xs text-on-surface-variant/70 mt-1 flex items-center font-semibold">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        Analysis updated at {new Date(report.timestamp).toLocaleString()} &middot; SentiScope Intelligence
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-on-surface-variant bg-card/60 rounded-xl border border-card-border/40 px-3.5 py-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span>Signal Strength: <strong className="text-on-surface font-extrabold">Strong</strong></span>
                    </div>
                  </div>

                  {/* 1. Dashboard Tab View */}
                  {activeTab === "dashboard" && (
                    <div className="space-y-8">
                      {/* Metric Cards Row */}
                      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {report.metrics.map((metric, index) => (
                          <StatCard key={index} {...metric} />
                        ))}
                      </section>

                      {/* Health circular gauge & Business Insights */}
                      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {report.businessIntelligence && (
                          <DiscussionHealthCard riskAssessment={report.businessIntelligence.riskAssessment} />
                        )}
                        <div className="lg:col-span-8">
                          <BusinessInsightsSection insights={report.businessIntelligence?.insights || []} />
                        </div>
                      </section>

                      {/* Executive summary & warnings alerts */}
                      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7">
                          <ExecutiveSummaryCard insights={report.insights} topic={report.topic} />
                        </div>
                        <div className="lg:col-span-5">
                          <AlertCard alerts={report.alerts as BackendAlert[]} />
                        </div>
                      </section>

                      {/* Topic Intelligence Cards row */}
                      {report.topicIntelligence && (
                        <section>
                          <TopicIntelligenceSection topicIntelligence={report.topicIntelligence} />
                        </section>
                      )}

                      {/* Recharts Analytics Distribution wrapper */}
                      <section>
                        <AnalyticsCharts
                          sentimentData={report.sentimentDistribution}
                          emotionData={report.emotionAnalysis}
                          trendingTopics={report.trendingTopics}
                        />
                      </section>

                      {/* Raw feed list */}
                      <section>
                        <PostsFeed posts={report.posts as BackendPostDetail[]} />
                      </section>
                    </div>
                  )}

                  {/* 2. Dedicated Analytics Tab */}
                  {activeTab === "analytics" && (
                    <section className="animate-fade-in">
                      <AnalyticsCharts
                        sentimentData={report.sentimentDistribution}
                        emotionData={report.emotionAnalysis}
                        trendingTopics={report.trendingTopics}
                      />
                    </section>
                  )}

                  {/* 3. Dedicated Business Insights Tab */}
                  {activeTab === "insights" && (
                    <section className="space-y-8 animate-fade-in">
                      <BusinessInsightsSection insights={report.businessIntelligence?.insights || []} />
                      {report.topicIntelligence && (
                        <TopicIntelligenceSection topicIntelligence={report.topicIntelligence} />
                      )}
                    </section>
                  )}

                  {/* 4. Dedicated Alerts Tab */}
                  {activeTab === "alerts" && (
                    <section className="animate-fade-in max-w-3xl mx-auto">
                      <AlertCard alerts={report.alerts as BackendAlert[]} />
                    </section>
                  )}

                  {/* 5. Dedicated Summary Tab */}
                  {activeTab === "summary" && (
                    <section className="animate-fade-in max-w-3xl mx-auto">
                      <ExecutiveSummaryCard insights={report.insights} topic={report.topic} />
                    </section>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Floating Mobile navigation bar */}
      <FloatingBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
