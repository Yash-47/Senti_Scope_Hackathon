import asyncio
import time
import sys
from app.services.sentiment_service import sentiment_service

def safe_print(*args, sep=" ", end="\n"):
    text = sep.join(str(arg) for arg in args)
    encoding = sys.stdout.encoding or "utf-8"
    encoded = text.encode(encoding, errors="replace")
    sys.stdout.buffer.write(encoded + end.encode(encoding))
    sys.stdout.flush()

async def main():
    # 1. 11 manually written social-media style sentences representing various categories
    test_sentences = [
        "This new Tesla Model Y is absolutely incredible, the smoothest ride I've ever had!", # Positive
        "Highly disappointed with the battery life of the new device. It drains so fast.", # Negative
        "The company announced its quarterly earnings report this afternoon.", # Neutral
        "The camera on this phone is fantastic, but the software crashes constantly.", # Mixed
        "Just got the new upgrade and I'm loving it! 😍🚀", # Emoji Positive
        "The service was terrible. Never coming back here again 😡👎", # Emoji Negative
        "Cool.", # Short text
        # Long text
        "I've been testing this new software platform for the past three weeks in various environments, "
        "including mobile and desktop, and overall the interface feels really clean, though there are "
        "still minor lag issues when loading large datasets.",
        "", # Empty string
        "    ", # Whitespace
        "The new car looks amazing but it is way too expensive for me 😭 overall mixed feelings." # Mixed Emoji
    ]

    safe_print("=" * 70)
    safe_print("Starting Sentiment Service Validation & Benchmarking...")
    safe_print("=" * 70)
    
    # 2. Measure batch inference
    start_time = time.perf_counter()
    results = await sentiment_service.analyze_batch(test_sentences)
    total_time = time.perf_counter() - start_time
    
    # 3. Print output details
    for i, (sentence, result) in enumerate(zip(test_sentences, results), 1):
        safe_print(f"Sentence #{i}: '{sentence}'")
        safe_print(f"  Predicted Sentiment: {result.get('sentiment')}")
        safe_print(f"  Confidence:          {result.get('confidence')}")
        safe_print(f"  Reason:              {result.get('reason')}")
        safe_print("-" * 50)
        
    # 4. Calculate and print benchmark metrics
    num_sentences = len(test_sentences)
    avg_time = total_time / num_sentences
    posts_per_sec = num_sentences / total_time
    
    safe_print("=" * 70)
    safe_print("Benchmark Summary:")
    safe_print(f"  Total sentences:        {num_sentences}")
    safe_print(f"  Total inference time:   {total_time:.4f} seconds")
    safe_print(f"  Average inference time: {avg_time:.4f} seconds per sentence")
    safe_print(f"  Throughput:             {posts_per_sec:.2f} posts per second")
    safe_print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
