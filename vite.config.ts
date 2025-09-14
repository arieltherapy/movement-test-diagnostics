// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // טוען משתני סביבה אם צריך

  return {
    plugins: [react()],
    // <<< חשוב: החלף לשם הריפו שלך בגיטהאב >>>
    base: '/movement-test-diagnostics/',  // אם שם הריפו שונה – עדכן פה
    build: { outDir: 'docs' },            // נבנה לתיקיית docs עבור GitHub Pages

    // אם יש לכם שימוש ב־env, נשמרים כמו שהיו
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    // אליאס נקי שעובד ב-ESM
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
