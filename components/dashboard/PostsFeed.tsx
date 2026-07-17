import React, { useState } from "react";
import PostCard from "./PostCard";
import { BackendPostDetail } from "../../types";

interface PostsFeedProps {
  posts: BackendPostDetail[];
}

export default function PostsFeed({ posts }: PostsFeedProps) {
  const [visibleCount, setVisibleCount] = useState(5);

  if (!posts || posts.length === 0) {
    return null;
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, posts.length));
  };

  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <div className="glass-card p-6 w-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-base font-extrabold text-on-surface">Critical Discussions</h3>
        <span className="text-xs text-on-surface-variant/50 font-bold">{posts.length} posts retrieved</span>
      </div>

      <div className="divide-y divide-outline/10 overflow-y-auto max-h-[460px] no-scrollbar pr-1">
        {visiblePosts.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}
      </div>

      {visibleCount < posts.length && (
        <button
          onClick={handleLoadMore}
          className="w-full mt-4 py-3 border border-outline/20 hover:bg-primary/5 hover:border-primary/40 rounded-xl font-bold text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer text-center"
        >
          Load More Discussions
        </button>
      )}
    </div>
  );
}
