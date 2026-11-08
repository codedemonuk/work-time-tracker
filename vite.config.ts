import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig(() => {
	process.env.PUBLIC_APP_VERSION = pkg.version;

	return {
		plugins: [
			sveltekit({
				adapter: adapter({
					fallback: '404.html'
				}),
				preprocess: vitePreprocess()
			})
		],
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version)
		}
	};
});
