import React, { useState } from 'react';
import { Star, ShoppingBag, Clock, Layout, Globe2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

interface HUDProps {
  timeLeft: number;
  onShopClick: () => void;
  viewMode: 'cards' | 'world';
  onViewModeChange: () => void;
}

export const HUD: React.FC<HUDProps> = ({ timeLeft, onShopClick, viewMode, onViewModeChange }) => {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const stars = useGameStore(state => state.stars);
  const setLanguage = useGameStore(state => state.setLanguage);
  const { t, language } = useTranslation();
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  /**
   * Available languages for the game
   */
  const languages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ja', name: '日本語' }
  ];

  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      <div className="bg-white rounded-full px-4 py-2 shadow flex items-center gap-2">
        <Clock className="w-5 h-5 text-purple-600" />
        <span className="font-mono text-lg text-purple-600">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      <div className="bg-white rounded-full px-4 py-2 shadow flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <span className="font-bold text-gray-700">{stars}</span>
      </div>
      <button 
        onClick={onViewModeChange}
        className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors flex items-center gap-2"
        title={t(`viewMode.${viewMode}`)}
      >
        <Layout className="w-6 h-6 text-purple-600" />
        <span className="text-purple-600 text-sm whitespace-nowrap">
          {t(`viewMode.${viewMode}`)}
        </span>
      </button>
      <div className="relative">
        <button 
          onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
          className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors"
        >
          <Globe2 className="w-6 h-6 text-purple-600" />
        </button>
        {languageMenuOpen && (
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
          {languages.map(({ code, name }) => (
            <button
              key={code}
              onClick={() => setLanguage(code as 'de' | 'en' | 'es' | 'fr' | 'ja')}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors ${
                language === code ? 'text-purple-600 font-bold' : 'text-gray-700'
              }`}
            >
              {name}
            </button>
          ))}
          </div>
        )}
      </div>
      <button 
        onClick={onShopClick}
        className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors"
      >
        <ShoppingBag className="w-6 h-6 text-purple-600" />
      </button>
    </div>
  );
};