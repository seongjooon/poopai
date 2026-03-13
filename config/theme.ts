import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemePalette {
  background: string;
  secondaryBackground: string;
  tertiaryBackground: string;
  elevatedBackground: string;
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  quaternaryLabel: string;
  systemBlue: string;
  systemGreen: string;
  systemRed: string;
  systemYellow: string;
  systemOrange: string;
  systemPurple: string;
  separator: string;
  opaqueSeparator: string;
  link: string;
  primary: string;
  success: string;
  error: string;
  warning: string;
  border: string;
  cardBackground: string;
  cardBorder: string;
  inputBackground: string;
  inputBorder: string;
  placeholder: string;
  accentBackground: string;
  successBackground: string;
  warningBackground: string;
  errorBackground: string;
  onPrimary: string;
  overlay: string;
  statusBarStyle: 'light-content' | 'dark-content';
}

export const lightColors: ThemePalette = {
  background: '#FFFFFF',
  secondaryBackground: '#F2F2F7',
  tertiaryBackground: '#FFFFFF',
  elevatedBackground: '#FFFFFF',
  label: '#000000',
  secondaryLabel: '#636366',
  tertiaryLabel: '#8E8E93',
  quaternaryLabel: '#AEAEB2',
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemRed: '#FF3B30',
  systemYellow: '#FFCC00',
  systemOrange: '#FF9500',
  systemPurple: '#AF52DE',
  separator: '#D1D1D6',
  opaqueSeparator: '#C6C6C8',
  link: '#007AFF',
  primary: '#007AFF',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  border: '#D1D1D6',
  cardBackground: '#F7F8FC',
  cardBorder: '#E7E9F2',
  inputBackground: '#F2F2F7',
  inputBorder: '#D1D1D6',
  placeholder: '#8E8E93',
  accentBackground: '#EEF3FF',
  successBackground: '#E8F8EE',
  warningBackground: '#FFF6E8',
  errorBackground: '#FFEDEC',
  onPrimary: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.55)',
  statusBarStyle: 'dark-content',
};

export const darkColors: ThemePalette = {
  background: '#000000',
  secondaryBackground: '#1C1C1E',
  tertiaryBackground: '#2C2C2E',
  elevatedBackground: '#2C2C2E',
  label: '#FFFFFF',
  secondaryLabel: '#AEAEB2',
  tertiaryLabel: '#8E8E93',
  quaternaryLabel: '#636366',
  systemBlue: '#0A84FF',
  systemGreen: '#30D158',
  systemRed: '#FF453A',
  systemYellow: '#FFD60A',
  systemOrange: '#FF9F0A',
  systemPurple: '#BF5AF2',
  separator: '#3A3A3C',
  opaqueSeparator: '#38383A',
  link: '#0A84FF',
  primary: '#0A84FF',
  success: '#30D158',
  error: '#FF453A',
  warning: '#FF9F0A',
  border: '#38383A',
  cardBackground: '#1C1C1E',
  cardBorder: '#2C2C2E',
  inputBackground: '#1C1C1E',
  inputBorder: '#3A3A3C',
  placeholder: '#8E8E93',
  accentBackground: '#1B2E4F',
  successBackground: '#1C2D23',
  warningBackground: '#30261A',
  errorBackground: '#341D1D',
  onPrimary: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.55)',
  statusBarStyle: 'light-content',
};

export const colors = lightColors;

export const spacing = {
  s: 8,
  m: 16,
  l: 24,
  xl: 40,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};

interface ThemeContextValue {
  theme: ThemePalette;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const THEME_STORAGE_KEY = '@theme_mode_preference';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isThemeMode(value: string): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateThemeMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedMode && isThemeMode(storedMode)) {
          setThemeModeState(storedMode);
        }
      } catch (error) {
        console.warn('Failed to hydrate theme mode', error);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrateThemeMode();
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to persist theme mode', error);
    }
  }, []);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const isDark = resolvedTheme === 'dark';
  const theme = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      resolvedTheme,
      isDark,
      setThemeMode,
    }),
    [theme, themeMode, resolvedTheme, isDark, setThemeMode]
  );

  if (!isHydrated) {
    return null;
  }

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
