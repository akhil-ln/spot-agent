# LoRRI Spot Procurement Agent

A powerful Spot Procurement Decision Agent built for the LoRRI logistics platform. This application helps manufacturers evaluate freight quotes from multiple Logistics Service Providers (LSPs) and get an AI recommendation to Accept, Negotiate, or Reject.

## Tech Stack

This project is structured as a monorepo containing both the frontend client and the AI-powered backend.

- **Frontend:** React (Vite)
- **Backend:** FastAPI (Python)
- **AI Integration:** Google Gemini reasoning model (via API)

---

## Project Structure

```
spot-agent/
├── client/           # React (Vite) frontend application
│   ├── src/          # Source code including components, screens, and API calls
│   └── package.json  # Frontend dependencies and scripts
├── api/           # FastAPI backend application
│   ├── app/          # Core backend logic and route handlers
│   └── main.py       # FastAPI application entry point
└── .env              # Environment variables (shared configuration)
```

---

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Python](https://www.python.org/) (v3.10+ recommended)
- A Google Gemini API Key.

---

## Installation & Setup

### 1. Environment Configuration

Create a `.env` file in the root of the project (`spot-agent/.env`) and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Backend Setup (FastAPI)

Navigate to the `api` directory and set up your Python environment.

```bash
cd api

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Running the Backend Layer

Ensure your virtual environment is active, then start the FastAPI development server:

```bash
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.

### 3. Frontend Setup (React/Vite)

Open a new terminal session, navigate to the `client` directory, and install the Node modules.

```bash
cd client

# Install dependencies
npm install
```

#### Running the Frontend Layer

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Core Features

1. **Spot Request Details:** View open freight requests including origin, destination, truck type, urgency, and cost thresholds.
2. **Raw LSP Quotes:** Tabular breakdown of quotes submitted by transporters including predicted rate, transit days, and truck availability.
3. **AI Analysis Engine:** Multi-step analytical engine that fetches predicted rates, benchmarks lane data, and runs a 5-dimension scoring system over the raw quotes.
4. **Recommendation Engine:** Employs Gemini AI reasoning to present the optimal decision (Accept, Negotiate, Reject) alongside a composite score and key risk callouts.

---

## Context

This project was built as part of a Hackathon to provide an internal logistics tool that is clean, data-dense, and highly actionable.
