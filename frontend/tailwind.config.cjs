const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: '#001220',
				secondary: '#FBAE3C'
			}
		},
		fontFamily: {
			body: ['Zilla Slab', 'serif']
		}
	},

	plugins: []
};

module.exports = config;
