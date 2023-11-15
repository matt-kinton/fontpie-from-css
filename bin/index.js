#! /usr/bin/env node

import { generateFallbackFonts } from '../src/index.js'

// load file from args
const file = process.argv[2]
if (!file) {
	console.error('Please provide a css file')
	process.exit(1)
}

const fonts = generateFallbackFonts(file)
if (!fonts.length) {
	console.error('No fonts found')
	process.exit(1)
}

const fontPieCss = fonts
	.map(
		({
			fontFamily,
			fontStyle,
			fontWeight,
			fallbackFont,
			ascentOverride,
			descentOverride,
			lineGapOverride,
			sizeAdjust,
		}) =>
			`@font-face {
	font-family: ${fontFamily};
	font-style: ${fontStyle};
	font-weight: ${fontWeight};
	src: local('${fallbackFont}');
	ascent-override: ${ascentOverride};
	descent-override: ${descentOverride};
	line-gap-override: ${lineGapOverride};
	size-adjust: ${sizeAdjust};
}`
	)
	.join('\n\n')

console.log(
	`/* Fallback fonts generated by fontpie-from-css  */\n\n${fontPieCss}`
)