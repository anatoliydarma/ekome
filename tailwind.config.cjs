/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			colors: {
				sky: {
					50: '#f2f9f8',
					100: '#ddf0ee',
					200: '#bfe2de',
					300: '#9ed3ce',
					400: '#5fb1aa',
					500: '#439791',
					600: '#3a807f',
					700: '#356969',
					800: '#315759',
					900: '#2d4b4c',
					950: '#1a3032'
				},
				forest: {
					50: '#f3faeb',
					100: '#e5f3d4',
					200: '#cce8ae',
					300: '#aad87e',
					400: '#8bc655',
					500: '#75b83b',
					600: '#538828',
					700: '#406823',
					800: '#365420',
					900: '#2f481f',
					950: '#16270c'
				},
				sea: {
					50: '#ecfffe',
					100: '#cefffd',
					200: '#a3fefc',
					300: '#63fdfc',
					400: '#1df1f3',
					500: '#01d4d9',
					600: '#04aab6',
					700: '#0b8793',
					800: '#136b77',
					900: '#145965',
					950: '#07404b'
				}
			}
		},
		container: {
			padding: '1rem'
		},
		extend: {}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	]
};
