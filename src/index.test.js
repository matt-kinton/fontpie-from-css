import assert from 'node:assert'
import { test, before, mock, beforeEach, after, afterEach } from 'node:test'
import { generateFallbackFonts } from './index.js'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const woff2FontpieGeneratedProperties = {
	fallbackFont: 'Arial',
	ascentOverride: '90.00%',
	descentOverride: '22.43%',
	lineGapOverride: '0.00%',
	sizeAdjust: '107.64%',
	fontFilename: 'test.woff2',
	fontFormat: 'woff2',
	fontFamily: "'Test Fallback'",
	fontStyle: 'normal',
	fontWeight: '400',
}

const woffFontpieGeneratedProperties = {
	fallbackFont: 'Arial',
	ascentOverride: '90.00%',
	descentOverride: '22.43%',
	lineGapOverride: '0.00%',
	sizeAdjust: '107.64%',
	fontFilename: 'test.woff',
	fontFormat: 'woff',
	fontFamily: "'Test Fallback'",
	fontStyle: 'normal',
	fontWeight: '400',
}

before(() => {
	fs.mkdirSync(path.join(__dirname, '../test/fixtures'), { recursive: true })
})

let originalConsole = { ...console }
const mockedConsole = {
	log: mock.fn(),
	warn: mock.fn(),
	error: mock.fn(),
}

beforeEach(() => {
	console = mockedConsole
})

afterEach(() => {
	console = originalConsole
	mock.reset()
})

test('parses a css file and generates the font fallbacks', () => {
	const fontFile = path.join(__dirname, '../test/fixtures/fonts.css')

	// url's are relative to the css file
	fs.writeFileSync(
		fontFile,
		`
    @font-face {
      font-family: 'Test';
      font-style: normal;
      font-weight: 400;
      src: url('../fonts/test.woff')');
    }
  `
	)

	const fonts = generateFallbackFonts(fontFile)

	assert.deepStrictEqual(fonts, [woffFontpieGeneratedProperties])
})

test('checks all src urls until it finds a font file', () => {
	const fontFile = path.join(__dirname, '../test/fixtures/fonts.css')

	fs.writeFileSync(
		fontFile,
		`
    @font-face {
      font-family: 'Test';
      font-style: normal;
      font-weight: 400;
      src: url('../fonts/test.otf'), url('../fonts/test.woff2');
    }
  `
	)

	const fonts = generateFallbackFonts(fontFile)
	assert.deepStrictEqual(fonts, [woff2FontpieGeneratedProperties])
	assert.strictEqual(mockedConsole.error.mock.calls.length, 1)
})

test('ignores local fonts when parsing the url src', () => {
	const fontFile = path.join(__dirname, '../test/fixtures/fonts.css')

	fs.writeFileSync(
		fontFile,
		`
    @font-face {
      font-family: 'Test';
      font-style: normal;
      font-weight: 400;
      src: local('Test'), url('../fonts/test.woff')');
    }
  `
	)

	const fonts = generateFallbackFonts(fontFile)

	assert.deepStrictEqual(fonts, [woffFontpieGeneratedProperties])
})
