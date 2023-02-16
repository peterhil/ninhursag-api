module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'standard',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: [
        'svelte3',
    ],
    overrides: [
        {
            files: ['app/static/js/**/*.svelte'],
            processor: 'svelte3/svelte3',
            rules: {
                'import/first': ['off', 'always'],
                'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 2, maxEOF: 0 }],
            },
        },
    ],
    rules: {
        'comma-dangle': ['off', 'always'],
        'indent': ['error', 4],
        'no-console': ['off', 'always'],
    },
    settings: {
        // https://github.com/sveltejs/eslint-plugin-svelte3#svelte3ignore-styles
        'svelte3/ignore-styles': () => true,
    }
}
