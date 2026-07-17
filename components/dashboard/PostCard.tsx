import React from "react";
import { MessageSquare, Repeat, Heart, ExternalLink } from "lucide-react";
import { BackendPostDetail } from "../../types";

interface PostCardProps {
  post: BackendPostDetail;
}

const getSentimentTag = (sentiment: string) => {
  const s = sentiment.toLowerCase();
  if (s === "positive") {
    return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10";
  } else if (s === "negative") {
    return "bg-primary/10 text-primary border border-primary/10";
  } else {
    return "bg-secondary-container text-on-secondary-container border border-secondary-container/10";
  }
};

export default function PostCard({ post }: PostCardProps) {
  // Extract display handle
  const handle = post.author || post.subreddit || "anonymous";
  const initials = handle.replace("@", "").substring(0, 2).toUpperCase();

  // Create formatted post creation time
  const timeStr = post.date
    ? new Date(post.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "recent";

  return (
    <div className="py-4.5 first:pt-0 group hover:bg-primary/5 px-2 rounded-xl transition-all duration-200">
      <div className="flex gap-4">
        {/* User initials/avatar placeholder to prevent broken images */}
        <div className="w-11 h-11 rounded-full bg-primary/10 border-2 border-primary/15 flex items-center justify-center font-bold text-primary shrink-0 shadow-sm text-sm uppercase">
          {initials}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h5 className="font-extrabold text-on-surface text-xs sm:text-sm flex items-center gap-1.5">
                {handle}
                <span className="text-[10px] text-on-surface-variant/50 font-normal">{timeStr}</span>
              </h5>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-semibold pr-2">
                {post.text}
              </p>
            </div>
            
            <div className="text-right shrink-0">
              <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                getSentimentTag(post.sentiment)
              }`}>
                {post.sentiment}
              </span>
              <p className="text-[10px] font-bold text-primary mt-1 flex items-center gap-0.5 justify-end">
                <Heart className="h-3 w-3 fill-primary/10" />
                {post.score}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-4 text-[10px] text-on-surface-variant/60 font-extrabold">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {post.comments}
              </span>
              <span className="flex items-center gap-1">
                <Repeat className="h-3.5 w-3.5" />
                {Math.round(post.score * 0.1)}
              </span>
            </div>

            {post.postUrl && (
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary hover:underline"
              >
                View on Bluesky
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
