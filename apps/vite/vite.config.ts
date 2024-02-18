import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.TAMAGUI_BAIL_AFTER_SCANNING_X_CSS_RULES': false,
  },
  plugins: [react()],
})
