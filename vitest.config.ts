import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['tests/**/*.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		reporters: ['default', ['@d2t/vitest-ctrf-json-reporter', {}]]
	},
	coverage: {
		provider: 'istanbul',
		reporter: ['text', 'json', 'html']
	}
});
