/** @type {import('tailwindcss').Config} */
module.exports = {
  // scan the shared case registry (class strings live here) + local files
  content: ['../cases.tsx', './src/**/*.{ts,tsx}', './index.html'],
  theme: { extend: {} },
  plugins: [],
}
