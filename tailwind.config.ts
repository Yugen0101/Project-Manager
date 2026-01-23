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
                // TaskForge Beige Premium Palette
                primary: {
                    50: '#fdfcf9',
                    100: '#f7f3ed',
                    200: '#f1ede4',
                    300: '#e5dec9',
                    400: '#d9cfb0',
                    500: '#d97757', // Terracotta Accent
                    600: '#c26242',
                    700: '#8e4832',
                    800: '#5c2d20',
                    900: '#2e160e',
                    950: '#1c1917', // Stone Dark
                },
                accent: {
                    beige: '#fdfcf9',
                    stone: '#1c1917',
                    terracotta: '#d97757',
                    navy: '#0f172a',
                },
                // Status colors (Refined for beige)
                status: {
                    overdue: '#991b1b',
                    warning: '#92400e',
                    success: '#065f46',
                    info: '#1e40af',
                },
                // Priority colors (Refined for beige)
                priority: {
                    low: '#78716c',
                    medium: '#d97757',
                    high: '#9a3412',
                    critical: '#7f1d1d',
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
