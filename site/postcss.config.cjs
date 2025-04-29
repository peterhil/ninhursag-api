const autoprefixer = require('autoprefixer');
const mixins = require('postcss-mixins');
const nested = require('postcss-nested');

const config = {
	plugins: [
		mixins,
		nested,
		autoprefixer,
	],
};

module.exports = config;
