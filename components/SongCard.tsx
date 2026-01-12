
import React from 'react';
import { SongRecommendation, SongCategory } from '../types';

interface SongCardProps {
  song: SongRecommendation;
  index: number;
}

const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.artist} ${song.title}`)}`;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              song.category === SongCategory.KOREAN 
              ? 'bg-blue-50 text-blue-600' 
              : 'bg-purple-50 text-purple-600'
            }`}>
              {song.category === SongCategory.KOREAN ? '국내' : '해외'}
            </span>
            <span className="text-gray-400 text-xs font-medium">#{index + 1}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
            {song.title}
          </h3>
          <p className="text-gray-600 font-medium text-sm mb-3">
            {song.artist}
          </p>
          <p className="text-gray-500 text-xs leading-relaxed italic border-l-2 border-gray-100 pl-3">
            "{song.reason}"
          </p>
        </div>
        
        <a 
          href={youtubeSearchUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
          title="YouTube에서 듣기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default SongCard;
