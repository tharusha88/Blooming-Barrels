import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8000', // Change this if your PHP backend runs on a different port
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
