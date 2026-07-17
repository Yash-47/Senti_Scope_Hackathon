import os
import sys
from dotenv import load_dotenv
from atproto import Client

def safe_print(*args, sep=" ", end="\n"):
    text = sep.join(str(arg) for arg in args)
    encoding = sys.stdout.encoding or "utf-8"
    encoded = text.encode(encoding, errors="replace")
    sys.stdout.buffer.write(encoded + end.encode(encoding))
    sys.stdout.flush()

def main():
    # Load environment variables from .env if present
    load_dotenv()

    handle = os.getenv("BSKY_HANDLE")
    password = os.getenv("BSKY_APP_PASSWORD")

    if not handle or not password:
        safe_print("Error: BSKY_HANDLE or BSKY_APP_PASSWORD environment variables are not set.")
        sys.exit(1)

    client = Client()

    # Step 1: Login
    try:
        client.login(handle, password)
    except Exception as e:
        safe_print("[FAILURE] Login failed inside search verification.")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    # Step 2: Determine correct search method
    search_func = None
    inspected_methods = []

    # Check the standard location for feed namespaces
    feed_namespace = getattr(client.app.bsky, "feed", None)
    if feed_namespace:
        for name in ["search_posts", "searchPosts"]:
            inspected_methods.append(f"client.app.bsky.feed.{name}")
            if hasattr(feed_namespace, name):
                search_func = getattr(feed_namespace, name)
                break

    if not search_func:
        safe_print("The installed atproto SDK does not expose a supported public post search API compatible with this project.")
        safe_print("Inspected methods:")
        for method in inspected_methods:
            safe_print(f" - {method}")
        safe_print("Why search is unavailable: The feed namespace does not contain search_posts or searchPosts.")
        safe_print("Whether another official API is required: Please inspect client.app.bsky or verify package version compatibility.")
        sys.exit(1)

    # Step 3: Run search
    safe_print(f"Executing search query 'Tesla' using {search_func.__name__}...")
    try:
        # Call the search API with params dictionary
        params = {"q": "Tesla", "limit": 5}
        response = search_func(params=params)

        posts = getattr(response, "posts", [])
        safe_print(f"Total posts returned: {len(posts)}")
        safe_print("=" * 60)

        for i, post in enumerate(posts[:5], 1):
            author_display = getattr(post.author, "display_name", "") or getattr(post.author, "displayName", "")
            author_handle = getattr(post.author, "handle", "unknown")
            if not author_display:
                author_display = author_handle
                
            text = getattr(post.record, "text", "")
            indexed_at = getattr(post, "indexed_at", None) or getattr(post, "indexedAt", "")
            
            likes = getattr(post, "like_count", 0) or getattr(post, "likeCount", 0) or 0
            replies = getattr(post, "reply_count", 0) or getattr(post, "replyCount", 0) or 0
            reposts = getattr(post, "repost_count", 0) or getattr(post, "repostCount", 0) or 0

            safe_print(f"Post #{i}")
            safe_print(f"Author: {author_display}")
            safe_print(f"Handle: {author_handle}")
            safe_print(f"Timestamp: {indexed_at}")
            safe_print(f"Likes: {likes}")
            safe_print(f"Replies: {replies}")
            safe_print(f"Reposts: {reposts}")
            safe_print("-" * 40)
            safe_print(text)
            safe_print("=" * 60)

    except Exception as e:
        safe_print("[FAILURE] Search operation failed")
        safe_print("Full SDK Exception Trace:")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
