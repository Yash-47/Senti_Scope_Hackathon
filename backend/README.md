# SentiScope Analytics API Backend

SentiScope is a production-grade asynchronous FastAPI backend engineered to ingest social discussions, preprocess noise, analyze sentiment and emotions, and build social intelligence analytics reports in real-time.

This backend utilizes clean architecture principles, separating the API router routing layer, pipeline orchestration controllers, and specific data parsing services.

---

## Technical Stack

*   **Runtime:** Python 3.12
*   **Web Framework:** FastAPI
*   **Data Validation:** Pydantic v2
*   **HTTP Client:** Asynchronous `httpx`
*   **Logging:** `loguru`
*   **Caching:** `cachetools` (In-memory TTLCache)
*   **Server:** Uvicorn

---

## Folder Architecture

```text
backend/
├── app/
│   ├── main.py                     # Entry point bootstrapping FastAPI
│   ├── middleware.py               # Request tracing and latency logging
│   ├── core/
│   │   ├── config.py               # Env settings checking
│   │   └── logging.py              # Logger styling overrides
│   ├── routers/
│   │   ├── health.py               # Health check status endpoints
│   │   └── analyze.py              # core sentiment analyze router
│   ├── services/
│   │   ├── pipeline_service.py     # Central pipeline controller orchestrator
│   │   ├── bluesky_service.py      # Asynchronous app.bsky.feed.searchPosts query client
│   │   ├── preprocess_service.py   # Text cleaner trigger and filters
│   │   ├── sentiment_service.py    # Deterministic sentiment model mock
│   │   ├── emotion_service.py      # Deterministic emotion model mock
│   │   ├── topic_service.py        # Tokenizer keyword frequency extractor
│   │   ├── summary_service.py      # Structured business summary builder
│   │   ├── statistics_service.py   # Aggregations, active subreddits, averages
│   │   ├── alert_service.py        # Volatility thresholds rule checker
│   │   └── cache_service.py        # cachetools TTLCache wrapper
│   ├── models/
│   │   ├── request_models.py       # Query validation schemas
│   │   └── response_models.py      # CamelCase JSON schema envelopes
│   ├── utils/
│   │   ├── response_builder.py     # Packs response bodies with timing metrics
│   │   └── text_cleaner.py         # Regex filters for HTML/Markdown/Links
│   ├── constants/
│   │   └── stopwords.py            # English stopwords exclusion list
│   └── exceptions/
│       └── custom_exceptions.py    # Custom HTTP application errors
├── requirements.txt                # System packages file
├── .env.example                    # Sample configuration defaults
├── .env                            # Active runtime environment parameters
└── README.md                       # This document
```

---

## Setup & Local Installation

### 1. Prerequisites
Ensure you have **Python 3.12+** installed on your system.

### 2. Setup Virtual Environment
In the `backend` folder, initialize and activate a virtual environment:
```bash
python -m venv venv

# On Windows (Command Prompt)
venv\Scripts\activate

# On Windows (PowerShell)
venv\Scripts\Activate.ps1

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configuration
A `.env` file containing system defaults is already created at the root of `backend/`:
```env
PORT=8000
CACHE_TTL=600
LOG_LEVEL=INFO
```

### 5. Launch Development Server
Start the Uvicorn hot-reloader:
```bash
python app/main.py
```
Or run directly:
```bash
uvicorn app.main:app --port 8000 --reload
```
The server will boot on `http://localhost:8000`. You can browse the interactive Swagger Documentation at `http://localhost:8000/docs`.

---

## API Documentation

### 1. Project Meta Details
*   **Path:** `GET /`
*   **Description:** Returns metadata properties and runtime status checks.
*   **Response:**
    ```json
    {
      "project": "SentiScope",
      "status": "running",
      "version": "1.0"
    }
    ```

### 2. Service Health Check
*   **Path:** `GET /health`
*   **Description:** Basic endpoint for load balancer checkups.
*   **Response:**
    ```json
    {
      "status": "healthy"
    }
    ```

### 3. Analyze Keyword
*   **Path:** `POST /api/v1/analyze`
*   **Headers:** `Content-Type: application/json`
*   **Request Payload:**
    ```json
    {
      "keyword": "Tesla"
    }
    ```
    *   *Validation limits:* Max length 50 chars, min length 2 chars. Must contain at least one alphanumeric character. Empty or whitespace-only inputs are rejected with `400 Bad Request`.
*   **Standard Success Response (200 OK):**
    ```json
    {
      "metadata": {
        "requestId": "5e13d9a1-8d2a-4a6c-9be3-f72b3de9b109",
        "timestamp": "2026-07-16T21:15:38Z",
        "processingTime": "124.32ms",
        "source": "Bluesky",
        "keyword": "Tesla",
        "cached": false
      },
      "statistics": {
        "totalPosts": 100,
        "positivePercent": 68.0,
        "neutralPercent": 10.0,
        "negativePercent": 22.0,
        "averageScore": 412.3,
        "averageComments": 14.5,
        "mostActiveSubreddit": "@tesla.bsky.social"
      },
      "topics": ["fsd", "autopilot", "battery", "heating", "update", "screen", "delivery", "OTA", "highway", "braking"],
      "summary": "Public opinion on Tesla remains highly enthusiastic about FSD Autopilot v12 improvements...",
      "alerts": [
        {
          "type": "warning",
          "priority": "high",
          "title": "Low Data Warning",
          "description": "Fewer than 20 discussions were retrieved, which may lower statistical relevance."
        }
      ],
      "posts": [
        {
          "text": "FSD v12 is actually mindblowing drove 40 miles today zero interventions",
          "sentiment": "Positive",
          "confidence": 0.93,
          "emotion": "Joy",
          "subreddit": "@tesla.bsky.social",
          "author": "Tesla Official",
          "score": 980,
          "comments": 42,
          "date": "2026-07-16T20:15:38Z"
        }
      ]
    }
    ```

---

## Future AI Integration Roadmap

Replacing the mock analysis endpoints with production AI pipelines requires modifying only the internals of specific service files. **The schema contracts and routing paths will remain completely unchanged, ensuring the frontend requires zero edits.**

1.  **Sentiment Analysis:**
    *   *File to change:* `app/services/sentiment_service.py`
    *   *AI Target:* Slot in Hugging Face Transformers pipeline using a fine-tuned `cardiffnlp/twitter-roberta-base-sentiment-latest` model.
2.  **Emotion Classification:**
    *   *File to change:* `app/services/emotion_service.py`
    *   *AI Target:* Load a text emotion model like `j-hartmann/emotion-english-distilroberta-base` to predict Joy, Anger, Fear, Sadness, or Surprise.
3.  **Topic Keyword Extraction:**
    *   *File to change:* `app/services/topic_service.py`
    *   *AI Target:* Replace the basic token counter with `KeyBERT` keyword embeddings extraction.
4.  **AI Executive Summary:**
    *   *File to change:* `app/services/summary_service.py`
    *   *AI Target:* Integrate Google's `google-generativeai` SDK calling the Gemini Pro model, passing the compiled statistics and top keywords to generate business summaries.
