import commonjs from '@rollup/plugin-commonjs'
import image from '@rollup/plugin-image'
import resolve from '@rollup/plugin-node-resolve'
import sveltePreprocess from 'svelte-preprocess'
import styles from 'rollup-plugin-styles'
import svelte from 'rollup-plugin-svelte'
// import { eslint } from 'rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH;
const minify = production
const sourceMaps = !production
const outputDir = (dir = '') => { return (production ? 'app/static/dist/' : 'app/static/dev/') + dir }
const outputFormat = 'iife'
// https://github.com/d3/d3-interpolate/issues/58
const D3_WARNING = /Circular dependency.*d3-interpolate/

const plugins = [
    // eslint({
    //     exclude: [
    //         'src/**/*.{css,sass}',
    //     ]
    // }),

    svelte({
        extensions: ['.svelte', '.html'],
        include: [
            'app/static/js/**/*.svelte',
            'app/templates/**/*.html',
        ],
        preprocess: sveltePreprocess(),
    }),

    styles({
    }),

    image(),

    resolve({
        browser: true,  // default: false
        modulesOnly: false,  // default: false
        dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
        customResolveOptions: {
            moduleDirectories: [
                './node_modules/'
            ],
        },
        preferBuiltins: false,
    }),

    // Convert CommonJS libraries to ES6
    commonjs(),

    // Minify on production
    minify && terser(),
]

export default [{
    input: { main: 'app/static/js/main.js' },
    output: {
        name: 'main',
        dir: outputDir(),
        assetFileNames: '[name]-[hash][extname]',
        format: outputFormat,
        sourcemap: sourceMaps,
    },
    plugins: plugins,
    onwarn: (message) => {
        if (D3_WARNING.test(message)) { return }
    },
    watch: {
        chokidar: true,
        clearScreen: true,
        exclude: ['node_modules/**'],
        include: [
            'app/static/js/**/*',
            'app/static/style/**/*',
        ],
    },
}]