import globals from 'globals'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import svelteConfig from './svelte.config.js'
import ts from 'typescript-eslint'
import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			'no-undef': 'off'
		},
	},
	{
		files: [
			'**/*.js',
			'**/*.svelte',
			'**/*.svelte.js',
			'**/*.svelte.ts',
			'**/*.ts',
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			'brace-style': ['error', 'stroustrup', {
				allowSingleLine: true,
			}],
			'comma-dangle': ['off', 'always'],
			'no-console': ['off', 'always'],
		},
	},
)
