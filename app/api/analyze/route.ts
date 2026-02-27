import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase"; // 引入你之前的 Firebase 实例
import { collection, getDocs } from "firebase/firestore";

// 初始化 Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { userInput, imageBase64 } = await req.json();

    if (imageBase64) {
      console.log("📸 接收到图片数据，长度为:", imageBase64.length);
    }

    // 1. 从 Firestore 获取最新的援助资源库数据
    const resourcesCol = collection(db, "resources");
    const resourceSnapshot = await getDocs(resourcesCol);
    const database = resourceSnapshot.docs.map(doc => doc.data());

    // 2. 选择 Gemini 1.5 Flash 模型 (速度最快，适合黑客松 Demo)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. 编写给 AI 的系统级指令 (In-Context Learning)
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

    // 核心多模态逻辑：判断是否有图片，如果有，按格式装载
    let promptParts: any[] = [{ text: prompt }];

    if (imageBase64) {
      // 去除前面的 "data:image/jpeg;base64," 标头，只保留纯数据
      const base64Data = imageBase64.split(",")[1]; 
      const mimeType = imageBase64.split(";")[0].split(":")[1] || "image/jpeg";
      
      promptParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
    }

    // 4. 请求 AI 并在设定中强制要求返回 JSON
    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }],
      generationConfig: {
        responseMimeType: "application/json", // 强制输出 JSON 格式，Hackathon 必备防翻车技巧！
      },
    });

    let responseText = result.response.text();
    // 自动剥离可能带有的 markdown 标记，防止 JSON.parse 报错
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const aiData = JSON.parse(responseText);

    return NextResponse.json({ success: true, data: aiData });

  } catch (error) {
    console.error("AI 分析出错:", error);
    return NextResponse.json({ success: false, error: "AI 分析失败" }, { status: 500 });
  }
}