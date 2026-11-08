import { defineEnvVars } from '@sveltejs/kit/env';
import pkg from '../package.json' with { type: 'json' };

export const variables = defineEnvVars({
	// Exposed to the client and referenced from app.html as %sveltekit.env.PUBLIC_APP_VERSION%
	PUBLIC_APP_VERSION: {
		public: true,
		// Falls back to the package version when the variable is not set in the environment
		schema: (value) => value ?? pkg.version
	}
});
