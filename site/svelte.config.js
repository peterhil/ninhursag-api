import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			scss: {
				prependData: '@use "$src/variables.scss" as *;'
			},
			postcss: true
		})
	],
	kit: {
		adapter: adapter(),
		alias: {
			$component: 'src/lib/component',
			$store: 'src/lib/store',
			$style: 'src/style',
			$src: 'src',
		},
	}
}

export default config
