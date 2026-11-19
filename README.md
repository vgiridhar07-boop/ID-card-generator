# ID Card Generator & AI Design Studio

A full-stack, production-ready Student ID Card Generator and AI-Powered Design Studio built with Next.js 14, TypeScript, Tailwind CSS, SQLite, and Google Gemini AI.

---

## Features

### 1. AI Design Studio
- **Google Gemini Integration**: Uses Google's Gemini 3.1 Flash Lite model via the official Interactions API to understand natural language design prompts and generate structured identity design specifications.
- **Local SVG/CSS Dynamic Engine**: Translates design specifications directly into vector layouts, geometric borders, guilloche patterns, micro-dot grids, and corporate themes without requiring expensive third-party image generation APIs.
- **Resilient AI Pipeline**: Includes exponential backoff retry logic handling transient traffic spikes (HTTP 429, 500, 503) seamlessly.
- **Offline Sample Mode**: Built-in curated offline presets for immediate testing and prototyping without API keys.

### 2. Comprehensive ID Card Generation
- **Dual Orientation**: Supports both portrait (CR-80 vertical) and landscape (CR-80 horizontal) layouts.
- **Dynamic Elements**: Student photograph upload, college logo branding, institutional signatures, barcodes, and automated QR codes.
- **Flexible Data Fields**: Student name, roll number, department, blood group, emergency contact, validity dates, and address.
- **Live Preview & Flip View**: Real-time rendering of front and back sides with interactive preview cards.

### 3. Multi-Format Export
- **High-Resolution PNG**: Export crisp image cards for digital identity records.
- **Print-Ready PDF**: Export multi-page or combined identity cards ready for institutional printing.

### 4. College Vault & Multi-Tenant Management
- **College Profiles**: Store, switch, and manage multiple university or institutional branding presets.
- **SQLite Database**: Persistent local storage for colleges, student drafts, and template settings.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **AI Intelligence**: Google Gemini 3.1 Flash Lite / 3.8 Flash (`@google/genai` / Interactions API)
- **Database**: SQLite with `better-sqlite3`
- **Validation**: Zod schema validation
- **Rendering**: HTML5 Canvas, SVG vectors, Lucide icons

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vgiridhar07-boop/ID-card-generator.git
   cd ID-card-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.1-flash-lite
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── data/                  # SQLite database storage & templates
├── src/
│   ├── app/               # Next.js App Router (pages & API routes)
│   │   ├── api/ai/        # AI design-spec & status endpoints
│   │   ├── api/colleges/  # College management endpoints
│   │   └── api/drafts/    # Student card drafts endpoints
│   ├── components/
│   │   ├── card/          # ID card front/back components & themes
│   │   ├── editor/        # Live editor & AI Design Studio
│   │   ├── preview/       # Interactive live preview
│   │   └── export/        # PNG & PDF export components
│   ├── lib/
│   │   ├── ai/            # Gemini API service & validation schemas
│   │   └── db/            # SQLite repository & schema initialization
│   └── types/             # TypeScript definitions
└── public/                # Static assets & sample graphics
```

---

## License

MIT License.
