"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, MessageSquare, ExternalLink, Filter } from "lucide-react";
import { BackendPostDetail } from "../../types";

interface PostsTableProps {
  posts: BackendPostDetail[];
}

const getSentimentBadge = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "negative":
      return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    case "neutral":
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

const getEmotionBadge = (emotion: string) => {
  switch (emotion.toLowerCase()) {
    case "joy":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "anger":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    case "fear":
      return "text-violet-400 bg-violet-500/10 border-violet-500/20";
    case "sadness":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "surprise":
      return "text-pink-400 bg-pink-500/10 border-pink-500/20";
    case "disgust":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "neutral":
      return "text-gray-450 bg-gray-500/10 border-gray-500/20";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

export default function PostsTable({ posts }: PostsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [emotionFilter, setEmotionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const textMatch = (post.text || "").toLowerCase().includes(searchTerm.toLowerCase());
      const authorMatch = (post.author || "").toLowerCase().includes(searchTerm.toLowerCase());
      const handleMatch = (post.subreddit || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = textMatch || authorMatch || handleMatch;
      
      const matchesSentiment = sentimentFilter === "all" || post.sentiment.toLowerCase() === sentimentFilter.toLowerCase();
      const matchesEmotion = emotionFilter === "all" || post.emotion.toLowerCase() === emotionFilter.toLowerCase();
      return matchesSearch && matchesSentiment && matchesEmotion;
    });
  }, [posts, searchTerm, sentimentFilter, emotionFilter]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleSentimentChange = (val: string) => {
    setSentimentFilter(val);
    setCurrentPage(1);
  };

  const handleEmotionChange = (val: string) => {
    setEmotionFilter(val);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleRowClick = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10">
      
      {/* Table Header and Filter Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold tracking-wide text-white">
              Raw Social Discussions
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live indexed Bluesky posts and community sentiment tags
            </p>
          </div>
        </div>

        {/* Text Filter */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search posts or handles..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl border border-card-border bg-card-hover/40 py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Select Filters Dropdown */}
      <div className="flex flex-wrap items-center gap-3 border-b border-card-border pb-4 mb-4">
        <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-semibold mr-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        {/* Sentiment Filter dropdown */}
        <select
          value={sentimentFilter}
          onChange={(e) => handleSentimentChange(e.target.value)}
          className="rounded-lg border border-card-border bg-card-hover/50 px-3 py-1.5 text-xs font-medium text-gray-300 outline-none hover:border-gray-700 transition-colors cursor-pointer"
        >
          <option value="all">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
          <option value="neutral">Neutral</option>
        </select>

        {/* Emotion Filter dropdown */}
        <select
          value={emotionFilter}
          onChange={(e) => handleEmotionChange(e.target.value)}
          className="rounded-lg border border-card-border bg-card-hover/50 px-3 py-1.5 text-xs font-medium text-gray-300 outline-none hover:border-gray-700 transition-colors cursor-pointer"
        >
          <option value="all">All Emotions</option>
          <option value="joy">Joy</option>
          <option value="anger">Anger</option>
          <option value="fear">Fear</option>
          <option value="sadness">Sadness</option>
          <option value="surprise">Surprise</option>
          <option value="disgust">Disgust</option>
          <option value="neutral">Neutral</option>
        </select>

        {/* Quick Result Counter */}
        <div className="ml-auto text-xs text-gray-500">
          Showing <span className="font-semibold text-gray-350">{filteredPosts.length}</span> of{" "}
          <span className="font-semibold text-gray-355">{posts.length}</span> entries
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <th className="py-3 px-3">Sentiment</th>
              <th className="py-3 px-3">Emotion</th>
              <th className="py-3 px-3">Author</th>
              <th className="py-3 px-3 text-right">Likes</th>
              <th className="py-3 px-4">Post Preview</th>
              <th className="py-3 px-3 whitespace-nowrap text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/40 text-xs">
            {currentPosts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  No discussions found matching your filter parameters.
                </td>
              </tr>
            ) : (
              currentPosts.map((post, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleRowClick(post.postUrl)}
                  className="hover:bg-card-hover/20 cursor-pointer transition-colors active:bg-card-hover/40 group"
                >
                  {/* Sentiment Badge Column */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${getSentimentBadge(
                        post.sentiment
                      )}`}
                    >
                      {post.sentiment}
                    </span>
                  </td>

                  {/* Emotion Badge Column */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col items-start space-y-0.5">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${getEmotionBadge(
                          post.emotion
                        )}`}
                      >
                        {post.emotion}
                      </span>
                      {post.confidence !== undefined && (
                        <span className="text-[10px] text-gray-500 font-mono">
                          {Math.round(post.confidence * 100)}% conf
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Author Handle Column */}
                  <td className="py-3.5 px-3 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                    <span className="block text-gray-300 font-semibold">{post.author}</span>
                    <span className="block text-gray-500 text-[10px]">{post.subreddit}</span>
                  </td>

                  {/* Likes/Score Column */}
                  <td className="py-3.5 px-3 text-right text-gray-300 font-bold font-mono">
                    {post.score.toLocaleString()}
                  </td>

                  {/* Post Preview Column with dedicated View link */}
                  <td className="py-3.5 px-4 max-w-sm sm:max-w-md lg:max-w-lg">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-250 font-medium group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {post.text}
                      </span>
                      {post.postUrl && (
                        <div className="pt-1">
                          <a
                            href={post.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold space-x-1.5 transition-all"
                          >
                            <span>View on Bluesky</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Date Column */}
                  <td className="py-3.5 px-3 text-right text-gray-500 whitespace-nowrap">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-card-border/60 pt-4 mt-4">
          <span className="text-xs text-gray-500">
            Page <span className="font-semibold text-gray-350">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-350">{totalPages}</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-card-border bg-card-hover/40 p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-card-border bg-card-hover/40 p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
