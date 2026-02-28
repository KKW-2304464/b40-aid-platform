BantuAI 🤝 - KitaHack 2026
Empowering B40 Families through AI-Driven Aid Matching

1. Repository Overview & Team Introduction
This repository contains the source code for BantuAI, a multimodal web application developed for the KitaHack 2026 competition. BantuAI is designed to bridge the digital divide for the B40 community in Malaysia by simplifying social aid discovery.

👥 The Team (KT)
Kok Wen Kai & Tung Jia Jun.

GDGOC Chapter: TARUMT.

2. Project Overview
🚩 Problem Statement
Many B40 households in Malaysia suffer from "Information Poverty". While numerous government and NGO aid programs exist, the application processes are often hidden behind complex formal language barriers and fragmented websites. Families often do not know which aid they qualify for, leading to missed opportunities for support.

🌍 SDG Alignment
BantuAI is strictly aligned with the following United Nations Sustainable Development Goals:

Goal 1: No Poverty (Target 1.3): Implementing social protection systems for all.

Goal 10: Reduced Inequalities (Target 10.2): Promoting the social and economic inclusion of marginalized groups.

💡 Short Description
BantuAI allows users to upload photos of their bills or describe their hardships in their native language. Using Google’s Gemini AI, it identifies the user's specific needs and matches them with validated resources from a Firestore database, providing localized results on an interactive map.

3. Key Features
📸 Multimodal OCR Scan: Instantly reads TNB bills, hospital invoices, or school notices to extract intent.

🗣️ Language Adaptive AI: Automatically detects and responds in English, Malay, or Mandarin based on the user's input.

📍 Last-Mile Mapping: Visualizes the nearest aid processing centers using real-time coordinates.

🧠 Intelligent Reasoning: Provides personalized explanations for why a specific aid is recommended.

4. Overview of Technologies Used
☁️ Google Technologies
Google Gemini 2.5 Flash-lite: Utilized for its high-quota multimodal processing and OCR capabilities.

Firebase Firestore: Serves as the scalable NoSQL database for our 12+ validated aid entries.

Google Maps JavaScript API: Provides interactive map rendering and location markers.

🛠️ Other Tools & Libraries
Next.js (React): High-performance full-stack framework.

Vercel: Serverless deployment platform for high availability.

Tailwind CSS: For a mobile-first, accessible UI/UX.

5. Implementation Details & Innovation
🏗️ System Architecture
BantuAI utilizes a stateless, serverless architecture. The Next.js API routes handle image pre-processing, while Gemini acts as the intelligent orchestration layer, querying the Firestore database to perform semantic matching.

🔄 Workflow
Input: User uploads a bill (image) or types a query (text).

Processing: The system converts the image to Base64 and sends it to the Gemini API.

Matching: Gemini performs OCR, detects the language, and cross-references the data with our aid library.

Output: A structured JSON response is returned, rendering aid cards and map markers on the frontend.

6. Challenges Faced
A major technical hurdle was the 429 Rate Limit (Quota Exceeded) error encountered with the Gemini 2.5 Flash model. We overcame this by pivoting to Gemini 2.5 Flash-lite. This strategic decision allowed us to utilize a much higher free-tier request quota (up to 1,500 requests per day) while maintaining the multimodal accuracy required for Malaysian aid documents.

7. Installation & Setup
To run this project locally, follow these steps:

Clone the Repo:

git clone https://github.com/KKW-2304464/b40-aid-platform.git
cd b40-aid-platform

Install Dependencies:

npm install

Environment Variables:

Create a .env.local file and add your keys:

GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_key_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_key_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_key_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_key_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

Run Development Server:

npm run dev

8. Future Roadmap

0-6 Months: Expand the Firestore database to cover 100+ verified NGOs and Zakat funds across all 13 states.

6-12 Months: Launch a BantuAI WhatsApp Bot using Firebase Cloud Functions to assist users with low-end mobile devices.

12+ Months: Integrate with government APIs (e.g., LHDN, JKM) to allow users to apply for aid directly through the platform.