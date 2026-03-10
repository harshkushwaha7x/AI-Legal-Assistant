'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: 'dark' | 'light';
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    resolvedTheme: 'dark',
    setTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

function getSystemTheme(): 'dark' | 'light' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const saved = localStorage.getItem('legalai-theme') as Theme | null;
        if (saved) {
            setThemeState(saved);
        }
    }, []);

    useEffect(() => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        setResolvedTheme(resolved);

        // Apply to document
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => setResolvedTheme(media.matches ? 'dark' : 'light');
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, [theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('legalai-theme', newTheme);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
