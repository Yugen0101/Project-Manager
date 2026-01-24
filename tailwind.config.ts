import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // TaskForge Sophisticated Beige Palette
                primary: {
                    50: '#fdfcf9',   // Cream/Off-white
                    100: '#f7f3ed',  // Light beige
                    200: '#f1ede4',  // Soft beige
                    300: '#e5dec9',  // Medium beige
                    400: '#d9cfb0',  // Warm beige
                    500: '#c9b896',  // Main beige
                    600: '#b5a07d',  // Deep beige
                    700: '#9a8665',  // Dark beige
                    800: '#7d6d52',  // Darker beige
                    900: '#5c5038',  // Very dark beige
                    950: '#3d3525',  // Almost brown
                },
                accent: {
                    50: '#fef5f0',
                    100: '#fde9df',
                    200: '#fbd3c4',
                    300: '#f8b89d',
                    400: '#f39d76',
                    500: '#d97757',  // Soft terracotta (main accent)
                    600: '#c26242',  // Deeper terracotta
                    700: '#a84f35',  // Dark terracotta
                    800: '#8e4832',  // Very dark terracotta
                    900: '#5c2d20',  // Deep rust
                    950: '#2e160e',  // Almost black rust
                },
                beige: {
                    50: '#fdfcf9',
                    100: '#f7f3ed',
                    200: '#e5dec9',
                    300: '#d9cfb0',
                },
                // Status colors (softer, beige-compatible)
                status: {
                    success: '#7c9473', // Muted sage green
                    warning: '#d97757', // Terracotta
                    error: '#c85a54',   // Muted red
                    info: '#7a8fa3',    // Muted blue
                },
                priority: {
                    low: '#9a8665',
                    medium: '#d97757',
                    high: '#c26242',
                    critical: '#8e4832',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

export default config;
