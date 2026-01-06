/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                    900: '#78350F',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
