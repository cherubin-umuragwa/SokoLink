# SokoLink - AI Marketplace Matchmaker

SokoLink is an AI-powered marketplace matchmaker connecting informal traders (vegetable sellers, tailors, craftspeople, farmers) in East Africa with bulk buyers.

## Features

- **Dual View**: Separate interfaces for Sellers (to list products) and Buyers (to find suppliers).
- **AI Matching**: Uses Gemini 1.5 Flash to intelligently match supply with demand based on location, price, and quality.
- **Voice Input**: Support for voice-to-text listing creation (English/Swahili), critical for low-literacy users.
- **WhatsApp Integration**: One-click contact for seamless negotiation.
- **Market Insights**: AI-generated tips on demand trends in specific regions.

## Tech Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6 Modules)
- **AI**: Google Gemini 1.5 Flash
- **Persistence**: LocalStorage
- **Deployment**: Docker / Google Cloud Run

## Setup Instructions

1. **Clone the repository**
2. **Add Gemini API Key**:
   - Open the AI Studio Secrets panel.
   - Add a secret named `GEMINI_API_KEY`.
3. **Run locally**:
   - Use a local server like `npx vite` or just open `index.html` in a modern browser.

## Deployment

### Google Cloud Run
```bash
gcloud run deploy sokolink --source . --platform managed --region us-central1 --allow-unauthenticated
```

### Firebase Hosting
```bash
firebase init
firebase deploy
```

## License
Apache-2.0
