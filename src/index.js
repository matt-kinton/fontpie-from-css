import fs from 'fs'
import parse from 'css-parse'
import fontpie from 'fontpie-calc'
import path from 'node:path'

/**
 * @typedef {{ fontFamily: string, fontStyle: string, fontWeight: string, fallbackFont: string, ascentOverride: string, descentOverride: string, lineGapOverride: string, sizeAdjust: string }} FontFace
 * @typedef {Pick<FontFace, 'fontFamily' | 'fontStyle' | 'fontWeight'> & { src: string }} ParsedFontFace
 */

/**
 * Generates fallback fonts from a font css file
 * @param {string} fontFile
 * @returns {Array<FontFace>}
 */
export function generateFallbackFonts(fontFile) {
	// read file
	const css = fs.readFileSync(fontFile, 'utf8')

	const fonts = parseCssFonts(css)

	// load fonts relative to css file
	const fontsFolder = path.dirname(fontFile)

	return generateFontpieFallbackFonts(fontsFolder, fonts)
}

/**
 * Parses a css file and returns an array of font faces
 * @param {string} cssText
 * @returns {Array<ParsedFontFace>}
 */
function parseCssFonts(cssText) {
	const ast = parse(cssText)
	const fontFaces = ast.stylesheet.rules.filter(
		(rule) => rule.type === 'font-face'
	)

	const fontFaceObjects = fontFaces.map((fontFace) => {
		const fontFamily = fontFace.declarations.find(
			(decl) => decl.property === 'font-family'
		).value
		const fontStyle = fontFace.declarations.find(
			(decl) => decl.property === 'font-style'
		).value
		const fontWeight = fontFace.declarations.find(
			(decl) => decl.property === 'font-weight'
		).value
		const src = fontFace.declarations.find(
			(decl) => decl.property === 'src'
		).value

		return {
			fontFamily,
			fontStyle,
			fontWeight,
			src,
		}
	})

	return fontFaceObjects
}

/**
 * Generates fallback using fontpie-calc from an array of font faces
 * @param {string} fontsFolder
 * @param {Array<ParsedFontFace>} fonts
 * @returns {Array<FontFace>}
 */
function generateFontpieFallbackFonts(fontsFolder, fonts) {
	return fonts.map((fontFace) => {
		const { fontFamily, fontStyle, fontWeight, src } = fontFace

		const urls = [...src.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)].map(
			(match) => match[1]
		)

		let fonts = null
		while (fonts == null && urls.length) {
			const srcFont = urls.shift()

			// remove query params
			const fontFile = srcFont.split('?')[0]
			const name = `'${fontFamily.replace(/['"](.+?)['"]/, '$1')} Fallback'`

			fonts = fontpie(path.join(fontsFolder, fontFile), {
				name,
				style: fontStyle,
				weight: fontWeight,
			})
		}

		if (!fonts) {
			throw new Error(
				`Failed to generate fonts for: ${JSON.stringify(fontFace, null, 2)}`
			)
		}

		return fonts
	})
}
