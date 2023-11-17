# Fontpie from CSS

Generate fallback fonts from a CSS file using fontpie.

[build badge]:
	https://img.shields.io/github/actions/workflow/status/matt-kinton/fontpie-from-css/release.yml?branch=main&logo=github&style=flat-square
[build]:
	https://github.com/matt-kinton/fontpie-from-css/actions?query=workflow%3Arelease
[license badge]:
	https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square
[license]: https://github.com/matt-kinton/fontpie-from-css/blob/main/LICENSE

## Usage

```bash
npx fontpie-from-css <css-file>
```

**Note:** Font files are loaded relative to the CSS file, ideally the CSS file
should be in the same directory as the font files.

## Credit

This project is a simple wrapper around
[fontpie](https://github.com/pixel-point/fontpie) by
[pixel-point](https://github.com/pixel-point). All credit for the heavy lifting
goes to them.

## License

MIT
