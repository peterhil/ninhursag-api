import globals from 'globals'
import js from '@eslint/js'
import pluginPromise from 'eslint-plugin-promise'
import svelte from 'eslint-plugin-svelte'

import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

/** @type {import('eslint').Linter.Config[]} */
export default [
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    pluginPromise.configs['flat/recommended'],
    ...svelte.configs['flat/recommended'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'comma-dangle': ['off', 'always'],
            'indent': ['error', 4],
            'no-console': ['off', 'always'],
        },
    },
]
