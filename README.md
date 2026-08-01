# 🌸 Happy Girlfriend Day — Interactive Memory & Heartfelt Confession Experience

A luxury, cinematic, full-stack web application designed for **Happy Girlfriend Day**. Features interactive secret passcode access, ambient Web Audio synthesizers, personalized memory chapters, AI poem generation via Gemini, curated music player, PDF keepsake exporter, and a glowing Heartfelt Confession modal.

---

## ✨ Features

- **🔒 Secret Passcode Lock Screen**: Protects the experience with custom passcode validation, hint reveals, and interactive keypad feedback.
- **📜 Multi-Chapter Love Letter & Memory Journal**: Richly formatted chapters celebrating cherished memories, quiet moments, and shared dreams.
- **🎵 Generative Ambient Soundscape**: Built-in Web Audio API synthesizer playing relaxing pentatonic acoustic chords in real time.
- **🎧 Interactive Music Playlist**: Integrated audio player with play/pause, track seeking, volume control, and custom song lists.
- **🤖 Gemini AI Romantic Poem Generator**: Server-proxied Google Gemini API integration generating custom personalized poetry on demand.
- **💌 Heartfelt Confession Modal**:
  - Soft-focus glowing trigger button with ambient halo animations.
  - **Subtle Volume-Ducking**: Audio automatically softens when opening the modal for an intimate reading experience.
  - **Confetti Particle Explosion**: Celebratory particle burst upon submitting the final response.
- **📄 PDF Keepsake Exporter**: One-click export converting the memory journal into a downloadable PDF keepsake using `html2canvas` and `jspdf`.
- **🔔 Real-Time Webhook Notifications**: Server-side Discord webhook integration logging milestone unlocks and responses.
- **🌗 Dark / Light Mode Support**: Seamless theme toggling with accessible color contrast and typography.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **Animations**: Motion (`motion/react`), Canvas Confetti, Lottie React
- **Icons**: Lucide React
- **Backend & API**: Express.js, TypeScript (`tsx` / `esbuild`), `@google/genai` (Gemini API)
- **PDF & Export**: `jspdf`, `html2canvas`

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/happy-girlfriend-day.git
cd happy-girlfriend-day
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Copy the `.env.example` file to create your `.env` file:

```bash
cp .env.example .env
```

Fill in your configuration details inside `.env`:

```env
# Optional: Gemini API Key for AI Poem Generator
GEMINI_API_KEY="your_gemini_api_key_here"

# Optional: Discord Webhook URL for notification logging
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."

# Secret Passcode for the lock screen (Default: "forever")
SECRET_PASSWORD="forever"
```

### 4. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`.

---

## 📦 Production Build & Deployment

### Local Production Test

To test the production build locally:

```bash
npm run build
npm start
```

### Hosting Recommendations

#### Option A: Full-Stack Container Hosting (Recommended for Gemini API & Webhooks)
- **Platforms**: Render, Railway, Google Cloud Run, Fly.io, Heroku
- **Start Command**: `npm run build && npm start`
- **Environment Variables**: Set `GEMINI_API_KEY`, `DISCORD_WEBHOOK_URL`, and `SECRET_PASSWORD` in your platform's Environment Variables dashboard.

#### Option B: GitHub Pages / Vercel / Netlify (Static Client SPA)
- If deploying purely as a static SPA on GitHub Pages or Vercel:
  - Run `npm run build` to generate static assets in `dist/`.
  - Serve the `dist` directory.

---

## 📜 Scripts Overview

- `npm run dev`: Starts the dev server using `tsx server.ts` on port 3000.
- `npm run build`: Bundles client assets with Vite and compiles `server.ts` into CommonJS using `esbuild`.
- `npm run start`: Runs the compiled server via `node dist/server.cjs`.
- `npm run lint`: Runs TypeScript type checking (`tsc --noEmit`).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
