import { useEffect, useState } from 'react';


export function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    useEffect(() => {
        interface MediaQueryListEvent {
            matches: boolean;
        }

        const changeHandler = (event: MediaQueryListEvent): void => {
            setIsDarkMode(event.matches);
        };
    
        const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    
        matchMedia.addEventListener('change', changeHandler);
    
        return () => {
        matchMedia.removeEventListener('change', changeHandler);
        };
    }, []);
    
    return isDarkMode;
}