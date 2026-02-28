import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase"; 
import { collection, getDocs } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { userInput, imageBase64 } = await req.json();

    if (imageBase64) {
      console.log("📸 Receive photo, length:", imageBase64.length);
    }

    const resourcesCol = collection(db, "resources");
    const resourceSnapshot = await getDocs(resourcesCol);
    const database = resourceSnapshot.docs.map(doc => doc.data());

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a professional Malaysian B40 aid matching assistant. 
      
      【MISSION】:
      1. If an image is provided, perform OCR to identify the institution (e.g., Hospital, School, TNB) and the issue (e.g., overdue bill, medical cost).
      2. **LANGUAGE ADAPTIVITY**: Detect the language used by the user in their text or the uploaded image (English, Malay, or Chinese). 
      3. Your "reason" field MUST be written in the SAME language the user used. If multiple languages are detected, default to English.

      【RESOURCE DATABASE】:
      ${JSON.stringify(database)}

      User Input: "${userInput || "No text provided, please analyze the image"}"

      【OUTPUT FORMAT】:
      Return ONLY a JSON object. No markdown. No extra text.
      {
        "matches": [
          {
            "id": "resource_id",
            "name": "Name of the aid",
            "reason": "Explain WHY this matches in the user's detected language (e.g., if user asks in Chinese, answer in Chinese)",
            "confidence": 98,
            "application_url": "URL",
            "lat": 3.1412,
            "lng": 101.6865
          }
        ]
      }
    `;

    let promptParts: any[] = [{ text: prompt }];

    if (imageBase64) {
      const base64Data = imageBase64.split(",")[1]; 
      const mimeType = imageBase64.split(";")[0].split(":")[1] || "image/jpeg";
      
      promptParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }],
      generationConfig: {
        responseMimeType: "application/json", 
      },
    });

    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const aiData = JSON.parse(responseText);

    return NextResponse.json({ success: true, data: aiData });

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ success: false, error: "AI Analysis Failed" }, { status: 500 });
  }
}