import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                heading: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                xamanen: {
                    void: '#0A0C10',
                    surface: '#101522',
                    elevated: '#161D2E',
                    purple: '#65005E',
                    blue: '#3C84CE',
                    cyan: '#30EEE2',
                    red: '#FF1919',
                    border: 'rgba(255, 255, 255, 0.08)',
                    'border-cyan': 'rgba(48, 238, 226, 0.35)',
                    glass: 'rgba(16, 21, 34, 0.75)',
                    'glass-hover': 'rgba(22, 29, 46, 0.85)',
                    text: '#F0F2F5',
                    muted: 'rgba(240, 242, 245, 0.70)',
                    dimmed: 'rgba(240, 242, 245, 0.45)',
                },
            },
            boxShadow: {
                glass: '0 8px 32px 0 rgba(0, 0, 0, 0.40)',
                'neon-cyan': '0 0 20px rgba(48, 238, 226, 0.35)',
                'neon-blue': '0 0 20px rgba(60, 132, 206, 0.35)',
            },
            backdropBlur: {
                glass: '12px',
            },
        },
    },

    plugins: [forms],
};
