
import React, { useState, useEffect, useCallback } from 'react';
import { SongRecommendation } from './types';
import { getMusicRecommendations } from './services/geminiService';
import SongCard from './components/SongCard';

const PRESET_THEMES = [
  "활기찬 아침", "비 오는 날 차분한 감성", "도시적인 시티팝", 
  "지친 퇴근길 위로", "집중하기 좋은 로파이", "신나는 댄스곡"
];

function App() {
  const [theme, setTheme] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<SongRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleFetchRecommendations = useCallback(async (selectedTheme: string = theme) => {
    if (!selectedTheme.trim()) {
      setError("음악 테마나 장르를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await getMusicRecommendations(selectedTheme);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      setError(err.message || "추천을 가져오는 도중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [theme]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetchRecommendations();
    }
  };

  const handlePresetClick = (preset: string) => {
    setTheme(preset);
    handleFetchRecommendations(preset);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Commute Beats</h1>
          </div>
          <div className="text-xs text-gray-400 font-medium hidden sm:block">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
            오늘의 출퇴근을 위한<br />
            <span className="text-blue-600">완벽한 7곡</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            원하시는 음악 테마나 장르를 말씀해주세요. 국내 5곡, 해외 2곡을 엄선해드립니다.
          </p>
        </section>

        {/* Search Section */}
        <section className="mb-8">
          <div className="relative group">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="예: 비 오는 날 지하철에서 듣기 좋은 노래"
              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white text-gray-900 rounded-2xl px-6 py-5 text-lg outline-none transition-all shadow-sm group-hover:shadow-md"
            />
            <button
              onClick={() => handleFetchRecommendations()}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              {loading ? '검색 중...' : '추천받기'}
            </button>
          </div>

          {/* Preset Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className="text-xs font-semibold px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                {preset}
              </button>
            ))}
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl w-full"></div>
            ))}
          </div>
        )}

        {/* Results Section */}
        {!loading && recommendations.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">추천 리스트</h3>
              <button 
                onClick={() => handleFetchRecommendations()}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                재추천 받기
              </button>
            </div>
            {recommendations.map((song, idx) => (
              <SongCard key={`${song.title}-${idx}`} song={song} index={idx} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasSearched && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-500 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">어떤 음악을 듣고 싶으신가요?</h4>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              위의 입력창에 테마를 입력하거나 프리셋 버튼을 눌러보세요.
            </p>
          </div>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-12 border-t border-gray-100 mt-20 text-center">
        <p className="text-gray-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} Commute Beats. Powered by Gemini AI.
        </p>
      </footer>
    </div>
  );
}

export default App;
