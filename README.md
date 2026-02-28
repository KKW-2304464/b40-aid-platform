# BantuAI 🤝 - KitaHack 2026

BantuAI is an AI-driven platform designed to help B40 families in Malaysia identify and match available aid resources through simple text or photo uploads.

## 🌟 Project Overview
- **SDG Alignment:** Goal 1 (No Poverty) & Goal 10 (Reduced Inequalities).
- **Core Value:** Breaking the language and information barrier for social aid in Malaysia.

## 🚀 Key Features
- **Multimodal OCR Scan:** Snap a photo of your bills (TNB, Hospital, School fees) to get matched with aid.
- **Language Adaptive AI:** Supports English, Malay, and Mandarin based on user input.
- **Last-Mile Mapping:** Integrated Google Maps to find the nearest aid processing centers.

## 🛠️ Tech Stack (Google Cloud Ecosystem)
- **Framework:** Next.js (Deployed on Vercel)
- **AI:** Google Gemini 2.5 Flash-lite (Multimodal OCR & Logic)
- **Database:** Firebase Firestore
- **Maps:** Google Maps JavaScript API

## 🧩 Implementation Details
The system uses a modular architecture where the Next.js API route handles image-to-base64 conversion, sends it to Gemini for semantic analysis, and cross-references the result with our Firestore database of 12+ aid entries.

## 🚧 Challenges Faced
Handling API Rate Limits (429 Errors) was our biggest hurdle. We implemented model fallback logic to ensure high availability during the competition.

## 📅 Future Roadmap
- **Short-term (0-6 months):** Expand database to 100+ NGOs and state-level aid.
- **Mid-term (6-12 months):** Integrate WhatsApp Bot for users without smartphones.
- **Long-term (12+ months):** Partner with LHDN/KWSP for direct application integration.
