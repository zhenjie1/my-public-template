module.exports = {
	extends: [
		'@antfu',
		'@vue/prettier',
		// '@vue/prettier/@typescript-eslint',
	],
	rules: {
		'yml/no-tab-indent': 'off',
		curly: 'off',
		'@typescript-eslint/brace-style': 'off',
	},
}
