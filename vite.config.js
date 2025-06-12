import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/.*\.execute-api\..*\.amazonaws\.com\/.*/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 300
                            }
                        }
                    }
                ]
            },
            manifest: {
                name: 'ChatGPT Question App',
                short_name: 'ChatGPT Q&A',
                description: 'Ask questions and get answers from ChatGPT',
                theme_color: '#4F46E5',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    // Updated base path for GitHub Pages
    base: '/chatgpt-question-pwa/',
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    aws: ['aws-amplify'] // Keep AWS in separate chunk but don't dynamic import
                }
            }
        }
    },
    // Ensure proper asset resolution for GitHub Pages
    define: {
        // Ensure environment variables are available
        'import.meta.env.VITE_COGNITO_USER_POOL_ID': JSON.stringify(process.env.VITE_COGNITO_USER_POOL_ID),
        'import.meta.env.VITE_COGNITO_CLIENT_ID': JSON.stringify(process.env.VITE_COGNITO_CLIENT_ID),
        'import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID': JSON.stringify(process.env.VITE_COGNITO_IDENTITY_POOL_ID),
        'import.meta.env.VITE_AWS_REGION': JSON.stringify(process.env.VITE_AWS_REGION)
    }
})
