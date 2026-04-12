import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	
	process.env.PUBLIC_APP_VERSION = pkg.version;
	
	return {
		plugins: [sveltekit()],
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version)
		}
	};
});
