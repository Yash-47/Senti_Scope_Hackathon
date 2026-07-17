import asyncio
import time
import sys
from app.services.emotion_service import emotion_service

def safe_print(*args, sep=" ", end="\n"):
    text = sep.join(str(arg) for arg in args)
    encoding = sys.stdout.encoding or "utf-8"
    encoded = text.encode(encoding, errors="replace")
    sys.stdout.buffer.write(encoded + end.encode(encoding))
    sys.stdout.flush()

async def main():
    # 12 social-media style sentences representing various emotion categories
    test_sentences = [
        "Just got promoted! Today is the absolute best day of my life! 😄🎉", # happy
        "This company has the absolute worst customer service ever. I am so mad! 😡", # angry
        "There are loud sirens outside and the news says there is a dangerous situation nearby... kind of scared.", # fearful
        "So disappointed that the concert got cancelled today, I was looking forward to it. 😭", # sad
        "Wow! I was not expecting that ending at all! Incredible plot twist! 😲", # surprised
        "Yuck, this food is completely rotten and smells terrible. Gross. 🤢", # disgusted
        "The train leaves at 5:00 PM and arrives tomorrow morning.", # neutral
        "The upgrade has a really nice layout but it is extremely buggy and laggy.", # mixed
        "😍🔥🚀✨", # emoji-only
        "", # empty string
        "Awesome.", # short
        # long
        "I've spent the entire afternoon trying to resolve this network configuration problem, "
        "checking every router and cable connection in the office, but nothing seems to be working "
        "and I'm honestly starting to lose patience."
    ]

    safe_print("=" * 70)
    safe_print("Starting Emotion Service Validation & Benchmarking...")
    safe_print("=" * 70)
    
    # Measure batch inference
    start_time = time.perf_counter()
    results = await emotion_service.analyze_batch(test_sentences)
    total_time = time.perf_counter() - start_time
    
    # Print output details
    for i, (sentence, result) in enumerate(zip(test_sentences, results), 1):
        safe_print(f"Sentence #{i}: '{sentence}'")
        safe_print(f"  Predicted Emotion: {result.get('emotion')}")
        safe_print(f"  Confidence:        {result.get('confidence')}")
        safe_print(f"  Reason:            {result.get('reason')}")
        safe_print("-" * 50)
        
    # Calculate and print benchmark metrics
    num_sentences = len(test_sentences)
    avg_time = total_time / num_sentences
    throughput = num_sentences / total_time
    distribution = emotion_service.get_distribution()
    
    safe_print("=" * 70)
    safe_print("Benchmark Summary:")
    safe_print(f"  Total sentences:        {num_sentences}")
    safe_print(f"  Total inference time:   {total_time:.4f} seconds")
    safe_print(f"  Average inference time: {avg_time:.4f} seconds per sentence")
    safe_print(f"  Throughput:             {throughput:.2f} posts per second")
    safe_print("-" * 50)
    safe_print("Emotion Distribution:")
    for emo, pct in distribution.items():
        safe_print(f"  {emo:10}: {pct:.1f}%")
    safe_print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
