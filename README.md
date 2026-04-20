# MediaShield AI (Active OSINT Investigation Hub)

**MediaShield AI** is a cutting-edge active investigation terminal designed to combat sports media piracy, digital misinformation, and context manipulation. Built directly on Google Cloud infrastructure and utilizing **Gemini 1.5 Pro** for instantaneous multimodal triangulation, this platform allows analysts to upload suspicious media claims and immediately reverse-crawl the public web for context and forensic truth.

Designed entirely for enterprise-grade OSINT (Open Source Intelligence), this prototype bridges real-time web scraping with generative evaluation to provide instantaneous trust scores.

---

## Key Features

* **Real-Time OSINT Crawling:** Bypasses simulated data to physically scrape live DuckDuckGo News and Video indexes to map out where a disputed claim or video is spreading globally across YouTube, TikTok, and media outlets.
* **Gemini 1.5 Pro Forensic Triage:** Leverages Google's flagship multimodal model to visually scan the uploaded suspect image, compare it against the scraped contextual claims, and classify it mathematically (e.g. `Fake News`, `Piracy`, `Authentic`).
* **Instant Glassmorphic Dashboard:** Designed entirely with Vanilla CSS for an ultra-premium, dark-mode "SOC Terminal" aesthetic eliminating bloatware dependencies.
* **Global Cloud Architecture:** containerized securely for Google Cloud Run (Backend) and Firebase Global CDN (Frontend) deployment.

## Technology Stack

| Domain | Technlogies Used |
| :--- | :--- |
| **Frontend** | React, Vite, Vanilla CSS (Glassmorphism), Lucide-React, Firebase Hosting |
| **Backend API** | FastAPI, Python 3.12, Uvicorn, Gunicorn, Google Cloud Run |
| **AI / Machine Learning** | Google `gemini-3-flash-preview` (Multimodal Analysis), `sentence-transformers` (PyTorch CLIP), FAISS Vector DB |
| **Data Pipelines** | `duckduckgo-search` (OSINT Aggregation), Web Crawling |

---

## Local Development

To run the platform locally, the architecture is decoupled into two services:

### 1. The FastAPI Backend
> **Note:** Requires a native installation of Python 3.12+ and roughly 3GB of RAM to process the PyTorch Vector libraries locally.
1. `cd backend`
2. `pip install -r requirements.txt`
3. Add a `.env` file and insert `GEMINI_API_KEY="your-google-studio-key"`
4. `uvicorn main:app --reload`
*(Server runs on `http://localhost:8000`)*

### 2. The React Frontend
1. `cd frontend`
2. `npm install`
3. Make sure the `.env` file either excludes `VITE_API_URL` or points to `http://localhost:8000` for local testing.
4. `npm run dev`

---

## Cloud Deployment

This platform is rigorously architected for Serverless deployment on Google Cloud. 

#### Backend (Google Cloud Run)
The backend leverages a Docker container specifically configured to pre-download Hugging Face weights to bypass Serverless Boot-Time constraints.
```bash
cd backend
gcloud run deploy mediashield-backend --source . --region asia-south1 --allow-unauthenticated --memory 2Gi --set-env-vars GEMINI_API_KEY="your-key"
```

#### Frontend (Firebase Hosting)
Once you retrieve your `.run.app` Cloud Run URL, map it to `VITE_API_URL` locally inside `frontend/.env`.
```bash
cd frontend
npm run build
firebase deploy
```

---

*This prototype submission demonstrates deep structural engineering designed to safely and authentically evaluate the propagation of media using next-generation Generative AI models.*
