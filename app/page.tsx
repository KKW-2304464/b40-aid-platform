'use client';

import { useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!userInput.trim() && !imageBase64) return;
    
    setIsLoading(true);
    setResults(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, imageBase64 }),
      });
      
      const data = await res.json();
      if (data.success) {
        setResults(data.data.matches);
      } else {
        alert("Analysis failed, please try again!");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* 头部信息 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 tracking-tight">
            Bantu<span className="text-blue-600">AI</span> 🤝
          </h1>
          <p className="text-lg text-indigo-700 font-medium">
            KitaHack 2026 | Scan Bills · Intelligent Aid Matching System
          </p>
        </div>

        {/* 输入卡片 */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
          <label className="block text-gray-700 font-semibold mb-3 text-lg">
            Describe your situation or upload a bill/notice 📸:
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="E.g., I lost my job and have two children..."
            className="w-full h-24 p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 transition-all resize-none text-gray-800 text-lg mb-4"
          />
          <div className="flex items-center gap-4 mb-4">
            <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-2">
              <span>📷 Take Photo / Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {imageBase64 && (
              <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
                ✅ Image Uploaded
                <button onClick={() => setImageBase64(null)} className="text-red-500 ml-2 hover:underline">Delete</button>
              </div>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || (!userInput && !imageBase64)}
            className={`mt-4 w-full py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-md 
              ${isLoading || (!userInput && !imageBase64) ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1'}`}
          >
            {isLoading ? '🧠 AI is analyzing...' : '✨ Match Aid Resources'}
          </button>
        </div>

        {/* 结果展示区 */}
        {results && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">🎯 Recommended Solutions:</h2>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
              {results.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-xl border-l-8 border-indigo-500 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {item.confidence}% Match
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    <span className="font-semibold text-indigo-600">Why Recommend: </span>{item.reason}
                  </p>

                  {/* 📍 嵌入地图展示最近办理点 */}
                  {item.lat && item.lng && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                      <Map
                        defaultCenter={{ lat: item.lat, lng: item.lng }}
                        defaultZoom={13}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                      >
                        <Marker position={{ lat: item.lat, lng: item.lng }} />
                      </Map>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gray-500 hover:text-indigo-600 p-2"
                    >
                      📍 Navigate to Center
                    </a>
                    {item.application_url && (
                      <a
                        href={item.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                      >
                        Apply Now ➔
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </APIProvider>
          </div>
        )}
      </div>
    </div>
  );
}