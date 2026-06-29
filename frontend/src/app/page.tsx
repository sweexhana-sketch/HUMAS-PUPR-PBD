"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Sparkles, Download, Loader2 } from "lucide-react";
import axios from "axios";

const EVENTS = [
  "HUT RI",
  "Hari Bakti PU",
  "Hari Jadi Papua Barat Daya",
  "Idul Fitri",
  "Natal",
  "Tahun Baru",
  "Lainnya"
];

export default function Home() {
  const [event, setEvent] = useState(EVENTS[0]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [theme, setTheme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) {
      alert("Mohon masukkan tema ucapan");
      return;
    }
    
    setIsGenerating(true);
    setResultImage(null);

    try {
      // Panggil backend FastAPI
      const response = await axios.post("http://localhost:8000/buat-poster", {
        acara: `${event} ${year}`,
        tema: theme,
      });
      setResultImage(response.data.hasil);
    } catch (error) {
      console.error(error);
      alert("Gagal menghasilkan poster. Pastikan backend berjalan dan API Key valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-white">PUPR PBD</h1>
              <p className="text-xs text-blue-400 font-medium">AI Creative Studio</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Sistem Aktif</span>
            </div>
            <button className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                Parameter Desain
              </h2>
              
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Jenis Acara</label>
                  <select 
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  >
                    {EVENTS.map(evt => (
                      <option key={evt} value={evt}>{evt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tahun</label>
                  <input 
                    type="number" 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Contoh: 2026"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tema Ucapan</label>
                  <textarea 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Contoh: Bersama Membangun Papua yang Lebih Maju dan Sejahtera"
                  />
                </div>

                <div className="pt-2">
                  <p className="block text-sm font-medium text-slate-300 mb-2">Aset Tambahan</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl hover:bg-slate-800/50 hover:border-blue-500/50 transition-all text-slate-400 hover:text-blue-400 group">
                      <Upload className="w-6 h-6 mb-2 group-hover:-translate-y-1 transition-transform" />
                      <span className="text-xs font-medium">Upload Logo</span>
                    </button>
                    <button type="button" className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl hover:bg-slate-800/50 hover:border-blue-500/50 transition-all text-slate-400 hover:text-blue-400 group">
                      <Upload className="w-6 h-6 mb-2 group-hover:-translate-y-1 transition-transform" />
                      <span className="text-xs font-medium">Foto ASN (Opsional)</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold shadow-lg shadow-blue-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        AI Sedang Bekerja...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Poster
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-2xl h-full flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="w-1.5 h-6 bg-yellow-500 rounded-full mr-3"></span>
                  Hasil Poster AI
                </h2>
                {resultImage && (
                  <a href={resultImage} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Download HD
                  </a>
                )}
              </div>

              <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden relative group">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium animate-pulse">Menyusun komposisi, warna, dan pencahayaan...</p>
                  </div>
                ) : resultImage ? (
                  <img src={resultImage} alt="Generated Poster" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-slate-500 p-8">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-medium">Belum ada desain yang di-generate</p>
                    <p className="text-xs mt-1 opacity-70">Isi form di sebelah kiri untuk memulai keajaiban AI</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
