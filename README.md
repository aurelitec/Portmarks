# Portmarks

[![Version badge](https://img.shields.io/github/v/tag/aurelitec/Portmarks?color=forestgreen&label=version)](https://github.com/aurelitec/Portmarks/releases)
[![MIT License badge](https://img.shields.io/github/license/aurelitec/Portmarks?color=9c0000)](LICENSE)
[![GitHub Code Size badge](https://img.shields.io/github/languages/code-size/aurelitec/Portmarks)](https://github.com/aurelitec/Portmarks)
[![Contributions Welcome badge](https://img.shields.io/badge/contributions-welcome-cornflowerblue)](#Contributing)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/aurelitec/Portmarks/total)

**Portmarks** lets you create portable HTML bookmark files for any web page. Your bookmarks work everywhere—no browser sync, no cloud dependency, just tiny files you own. Free and open source.

- **Own Your Data:** Bookmarks are saved as local HTML files. You have complete control, with no cloud dependency, tracking, or accounts.
- **Universal & Portable:** Works in any browser on any OS. Organize your bookmarks in folders, sync them via cloud storage, or share them anywhere.
- **Simple & Private:** Installs as a lightweight bookmarklet that runs entirely in your browser. The process is completely offline and private by design.

## The Portable Bookmark File

Portmarks generates a minimal HTML file with a `.portmark.html` extension. This dual extension ensures it's recognized as a standard HTML file by your system while also indicating its origin from Portmarks.

The core design principle is to be as tiny and universal as possible. The entire file is a single line of HTML, containing only the essential `meta` refresh tag needed to redirect your browser.

Here is an example for `https://example.com`:

```html
<html><head><meta http-equiv="refresh" content="0;url=https://example.com/" /></head><body></body></html>
```

## Quick Start

1. Download the [Portmarks bookmarklet](https://github.com/aurelitec/Portmarks/releases/latest/download/portmarks-bookmarklet-1.0.0.zip) from GitHub Releases and unzip it.
2. Open the `install.html` file in your browser.
3. Drag the **Portmarks** button to your bookmarks bar.
4. Click the bookmarklet on any page to download a portable bookmark file.

## Project Structure

- `bookmarklet/` — Source code and install files for the Portmarks bookmarklet.
- `bookmarklet/dist/` — Distribution files and release ZIPs (after building).

## Building from Source

If you want to modify the bookmarklet or build it yourself, follow these steps:

1.  Clone the repository:
    ```sh
    git clone https://github.com/aurelitec/Portmarks.git
    ```
2.  Navigate to the `bookmarklet` directory:
    ```sh
    cd Portmarks/bookmarklet
    ```
3.  Install the development dependencies:
    ```sh
    npm install
    ```
4.  Run the build script:
    ```sh
    npm run build
    ```

The distributable files will be generated in the `bookmarklet/dist/files` directory.

## Contributing

Contributions are welcome! If you have a suggestion or find a bug, please [open an issue](https://github.com/aurelitec/Portmarks/issues).

If you'd like to contribute code, please fork the repository and submit a pull request.

## License

Portmarks is a free, open-source project by **Aurelitec**, released under the [MIT License](LICENSE).

## Support Us!

We can offer our apps for free because we are supported by our partners at **[East-Tec](https://www.east-tec.com/)**, developers of award-winning privacy and security software since 1997. You can support us by trying their products.

**While Portmarks helps you save the sites you want to remember, [east-tec Eraser](https://www.east-tec.com/eraser/) helps you forget the ones you don't want anyone to know about.**

<p><br><a href="https://www.east-tec.com/">
  <img  src="repo-assets/east-tec-product-boxes.png" alt="East-Tec product boxes" width="300">
</a></p>
