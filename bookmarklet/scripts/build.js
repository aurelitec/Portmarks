#!/usr/bin/env node

/**
 * The Portmarks bookmarklet build script.
 *
 * Compiles the bookmarklet from source code and writes it to a file in the dist directory. Also
 * updates the install page with the compiled bookmarklet code and copies necessary files to the
 * dist directory.
 *
 * Usage: `npm run build`
 *
 * @version 1.0.0
 * @copyright Copyright (c) 2010-2025 Aurelitec
 * @license MIT
 * @website https://www.aurelitec.com
 *
 * @author TechAurelian <contact@techaurelian.com> (https://techaurelian.com)
 */

import { readFile, writeFile, mkdir, copyFile } from "fs/promises";
import { join } from 'path';
import { minify } from 'terser';

/**
 * Configuration constants for the bookmarklet build process.
 */
const CONFIG = {
  // Directory where the compiled bookmarklet and related files will be saved
  distDir: join(import.meta.dirname, '../dist/files'),

  // The bookmarklet source code to be compiled and copied to the dist directory
  bookmarklet: {
    source: join(import.meta.dirname, '../src/bookmarklet.js'),
    output: join(import.meta.dirname, '../dist/files/bookmarklet.uri.txt'),
  },

  // The install page to be updated with the compiled bookmarklet code and copied to dist
  installPage: {
    source: join(import.meta.dirname, '../install/install.html'),
    output: join(import.meta.dirname, '../dist/files/install.html'),
  },

  // The README.txt file to be copied to the dist directory
  readmeFile: {
    source: join(import.meta.dirname, '../install/README.txt'),
    output: join(import.meta.dirname, '../dist/files/README.txt'),
  },

  // The sample portmark file to be copied to the dist directory
  samplePortmarkFile: {
    source: join(import.meta.dirname, '../install/www.aurelitec.com_portmarks.portmark.html'),
    output: join(import.meta.dirname, '../dist/files/www.aurelitec.com_portmarks.portmark.html'),
  }
};

/**
 * Terser minification options for aggressive compression.
 */
const MINIFY_OPTIONS = {
  compress: {
    passes: 3,          // Multiple passes for better compression
    negate_iife: false, // Do not negate IIFEs to prevent issues with bookmarklets
    toplevel: true,     // Drop unreferenced functions and variables in the top level scope
  },
  mangle: {
    toplevel: true,   // Mangle top-level variable names
  },
  format: {
    comments: false,  // Remove all comments
  },
};

/**
 * Compiles the bookmarklet from source code: minifies, encodes, and wraps it in a format suitable
 * for use as a bookmarklet.
 *
 * @param {string} sourceCode - The source code of the bookmarklet to compile.
 * @returns {Promise<string>} - The compiled bookmarklet code ready for use.
 * @throws {Error} If minification fails or encoding issues occur.
 */
async function compileBookmarklet(sourceCode) {
  try {
    // Minify the source code using Terser
    const result = await minify(sourceCode, MINIFY_OPTIONS);
    if (result.error) throw new Error(`Minification error: ${result.error}`);
    const minifiedCode = result.code;

    // Encode the minified code for bookmarklet usage
    const encodedCode = encodeURIComponent(minifiedCode);

    // The final step is to add the "javascript:" prefix so it can be used directly as a bookmarklet
    const bookmarkletCode = `javascript:${encodedCode}`;

    return bookmarkletCode;
  } catch (error) {
    throw new Error(`Failed to compile bookmarklet: ${error.message}`);
  }
}

/**
 * The main build function: compiles the bookmarklet from source code and writes the output files.
 */
async function build() {
  console.log('Building the Portmarks Bookmarklet and creating distribution files...\n');

  try {
    // Make sure the dist directory exists
    await mkdir(CONFIG.distDir, { recursive: true });

    // Read the source bookmarklet file
    const sourceCode = await readFile(CONFIG.bookmarklet.source, 'utf8');

    // Compile the bookmarklet code
    const bookmarkletCode = await compileBookmarklet(sourceCode);

    // Write bookmarklet code to file
    await writeFile(CONFIG.bookmarklet.output, bookmarkletCode, 'utf8');
    console.log(`✓ Wrote bookmarklet in ${CONFIG.bookmarklet.output}`);

    // Update the install page template with the compiled bookmarklet code
    const installTemplate = await readFile(CONFIG.installPage.source, 'utf8');
    const installPage = installTemplate.replace('{{ BOOKMARKLET_CODE }}', bookmarkletCode);
    await writeFile(CONFIG.installPage.output, installPage, 'utf8');
    console.log(`✓ Updated install page at ${CONFIG.installPage.output}`);

    // Copy README.txt and sample portmark file to dist directory
    await copyFile(CONFIG.readmeFile.source, CONFIG.readmeFile.output);
    await copyFile(CONFIG.samplePortmarkFile.source, CONFIG.samplePortmarkFile.output);
    console.log('✓ Copied README.txt and sample portmark file to dist directory');

    console.log('\n✅ Build completed successfully! Check the dist directory for output files.');
  }
  catch (error) {
    console.error(`\n❌ Build failed: ${error.message}`);
    process.exitCode = 1;
  }
}

// Run the build process
build();