import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
  const language = useGameStore(state => state.language);

  /**
   * Translate a key into the current language
   */
  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value[k];
      if (!value) return key;
    }

    if (typeof value === 'object' && value[language]) {
      return value[language];
    }

    return key;
  }, [language]);

  return { t, language };
};
