// 'use client'; // Add this at the top of the file

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// type Theme = 'light' | 'dark';

// interface ThemeContextProps {
//   theme: Theme;
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// export function useTheme() {
//   const ctx = useContext(ThemeContext);
//   if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
//   return ctx;
// }

// export function ThemeProvider({ children }: { children: ReactNode }) {
//   const [theme, setTheme] = useState<Theme>('light');
//   const [mounted, setMounted] = useState(false);

//   // Set mounted to true once the component is mounted to the client-side
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (mounted) {
//       const savedTheme = localStorage.getItem('theme') as Theme;
//       setTheme(savedTheme || 'light'); // Use saved theme or default to 'light'
//     }
//   }, [mounted]);

//   // Apply the theme class to the HTML element based on the theme
//   useEffect(() => {
//     if (mounted) {
//       document.documentElement.classList.toggle('dark', theme === 'dark');
//       localStorage.setItem('theme', theme); // Save theme in localStorage
//     }
//   }, [theme, mounted]);

//   const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

//   // Return nothing during the first render until client-side hydration
//   if (!mounted) {
//     return null;
//   }

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }
