/// <reference types="svelte-kit" />

declare namespace App {
	interface ImportMetaEnv {
		VITE_APP_VERSION: string;
	}
	interface ImportMeta {
		env: ImportMetaEnv;
	}
}

interface ImportMetaEnv {
	readonly __APP_VERSION__: string;
}
