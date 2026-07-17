import asyncio
import time
import sys
from app.services.topic_service import topic_service

def safe_print(*args, sep=" ", end="\n"):
    text = sep.join(str(arg) for arg in args)
    encoding = sys.stdout.encoding or "utf-8"
    encoded = text.encode(encoding, errors="replace")
    sys.stdout.buffer.write(encoded + end.encode(encoding))
    sys.stdout.flush()

async def main():
    # 20 realistic social media style posts representing noisy topics, casing variations, proper nouns, and version numbers
    test_posts = [
        {"text": "The new iPhone 17 design features a completely bezel-less screen and outstanding camera quality.", "sentiment": "Positive"},
        {"text": "Highly frustrated with the lag and slow UI response on my Samsung device after the latest update today.", "sentiment": "Negative"},
        {"text": "Tesla's FSD Autopilot v12 is driving incredibly smooth, handled tight city turns with zero interventions! #fsd #tesla", "sentiment": "Positive"},
        {"text": "Intermittent cabin heating and battery warning alerts are ruining the driving experience on my new EV.", "sentiment": "Negative"},
        {"text": "The Federal Reserve might cut interest rates next month due to slowing inflation metrics. announced today", "sentiment": "Neutral"},
        {"text": "The stock market had a massive rally today, with tech and AI shares surging to record highs. openai nvidia stocks", "sentiment": "Positive"},
        {"text": "The new LLM o1 reasoning capabilities are mindblowing, it writes complete python code in seconds.", "sentiment": "Positive"},
        {"text": "Weekly rate limits and high subscription pricing are major drawbacks of the new OpenAI tools. v2 version", "sentiment": "Negative"},
        {"text": "The championship match is scheduled to start at 8:00 PM tonight in the national stadium.", "sentiment": "Neutral"},
        {"text": "Unbelievable game! The team made an incredible comeback in the final quarter to win the trophy! 😍🔥🚀", "sentiment": "Positive"},
        {"text": "The recent political candidate debate showed severe polarization, with both sides arguing constantly.", "sentiment": "Negative"},
        {"text": "The government announced a new environmental policy package to regulate industrial carbon emissions.", "sentiment": "Neutral"},
        {"text": "I really love the anti-reflection OLED screen of the new TV, the colors look extremely vibrant.", "sentiment": "Positive"},
        {"text": "The television speakers sound incredibly tinny and cheap, definitely not worth the premium price. drawback!", "sentiment": "Negative"},
        {"text": "The conference will host multiple guest speakers discussing neural network design and deep learning.", "sentiment": "Neutral"},
        {"text": "My smart watch battery life drains in less than six hours, this product is absolute garbage. #battery #draining 😭", "sentiment": "Negative"},
        {"text": "Having access to fast charging at work makes electric vehicle ownership so much easier.", "sentiment": "Positive"},
        {"text": "I received my order this afternoon but the box was heavily damaged and the package was torn. issue", "sentiment": "Negative"},
        {"text": "The international trade delegation met this morning to draft the cooperation agreement.", "sentiment": "Neutral"},
        {"text": "A new merger agreement was announced between the two leading technology companies, changing the market landscape. openai samsung", "sentiment": "Neutral"}
    ]

    safe_print("=" * 70)
    safe_print("Starting KeyBERT Topic Intelligence Engine Benchmarking...")
    safe_print("=" * 70)
    
    # Measure batch extraction
    start_time = time.perf_counter()
    results = await topic_service.extract_topics_batch(test_posts)
    total_time = time.perf_counter() - start_time
    
    # Print output details
    def print_topic_list(title, items):
        safe_print(f"\n--- {title} ---")
        if not items:
            safe_print("  No topics found.")
            return
        for i, item in enumerate(items, 1):
            safe_print(f"  {i}. {item.get('keyword'):18} | Category: {item.get('category'):10} | KeyBERT score: {item.get('score'):.3f}")

    print_topic_list("Overall Topics (Top 10)", results.get("overall_topics", []))
    print_topic_list("Positive Topics (Top 5)", results.get("positive_topics", []))
    print_topic_list("Negative Topics (Top 5)", results.get("negative_topics", []))
    print_topic_list("Neutral Topics (Top 5)", results.get("neutral_topics", []))
    print_topic_list("Top Keyphrases (Top 5)", results.get("top_phrases", []))
    print_topic_list("Trending Keywords", results.get("trending_keywords", []))
    
    safe_print("\n" + "-" * 50)
    safe_print("Complaint & Praise Intelligence:")
    praise = results.get("top_praise")
    complaint = results.get("top_complaint")
    
    if praise:
        safe_print(f"\n  Top Praise:    {praise.get('keyword')} ({praise.get('category')})")
        safe_print("  Evidence:")
        for exp in praise.get("examples", []):
            safe_print(f"    - \"{exp}\"")
            
    if complaint:
        safe_print(f"\n  Top Complaint: {complaint.get('keyword')} ({complaint.get('category')})")
        safe_print("  Evidence:")
        for exp in complaint.get("examples", []):
            safe_print(f"    - \"{exp}\"")
        
    # Calculate and print benchmark metrics
    num_posts = len(test_posts)
    avg_time = total_time / num_posts
    throughput = num_posts / total_time
    
    safe_print("\n" + "=" * 70)
    safe_print("Benchmark Summary:")
    safe_print(f"  Total posts:            {num_posts}")
    safe_print(f"  Total extraction time:  {total_time:.4f} seconds")
    safe_print(f"  Average extraction time: {avg_time:.4f} seconds per post")
    safe_print(f"  Throughput:             {throughput:.2f} posts per second")
    safe_print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
