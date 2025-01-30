import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';
import dotenv from 'dotenv-flow';

dotenv.config();

// https://vitejs.dev/config/

const config = defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith('swiper-')
                }
            }
        }),
        vueJsx(),
        VueDevTools()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "./src/assets/styles/scss/_mixins.scss" as mix;
                    @use "./src/assets/styles/scss/_functions.scss" as func;
                `,
                loadPaths: ['/node_modules', './src/assets/styles/scss']
            }
        }
    },
    define: {
        'process.env.SERVICE__BASE_URL': JSON.stringify(process.env.SERVICE__BASE_URL),

        'process.env.SERVICE__SECURITY__CLIENT_ID': JSON.stringify(process.env.SERVICE__SECURITY__CLIENT_ID),
        'process.env.SERVICE__SECURITY__CLIENT_SECRET': JSON.stringify(process.env.SERVICE__SECURITY__CLIENT_SECRET),

        'process.env.FIREBASE__CONFIG__API_KEY': JSON.stringify(process.env.FIREBASE__CONFIG__API_KEY),
        'process.env.FIREBASE__CONFIG__AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE__CONFIG__AUTH_DOMAIN),
        'process.env.FIREBASE__CONFIG__PROJECT_ID': JSON.stringify(process.env.FIREBASE__CONFIG__PROJECT_ID),
        'process.env.FIREBASE__CONFIG__STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE__CONFIG__STORAGE_BUCKET),
        'process.env.FIREBASE__CONFIG__MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE__CONFIG__MESSAGING_SENDER_ID),
        'process.env.FIREBASE__CONFIG__APP_ID': JSON.stringify(process.env.FIREBASE__CONFIG__APP_ID)
    },
    server: {
        port: 1001
    }
});

export default config;
