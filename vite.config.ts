import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			 manifest: {
                name: 'Efficiency App',
                short_name: 'Efficiency App',
                description: 'A PWA for tracking your efficiency',
                theme_color: '#000000',
                icons: [
                    {
                        src: 'icons/pwa_icon.png', // Pfad relativ zum `static` Ordner
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/pwa_icon.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
		})
	]
});
