/**
 * The Portmarks bookmarklet source code.
 * 
 * Creates and automatically downloads portable HTML bookmark files for web page URLs that
 * automatically redirect to the original page when opened. Each generated file is a self-contained
 * bookmark that works universally across all platforms and devices.
 * 
 * @version 1.0.0
 * @copyright Copyright (c) 2010-2025 Aurelitec
 * @license MIT
 * @website https://www.aurelitec.com
 *
 * @author TechAurelian <contact@techaurelian.com> (https://techaurelian.com)
 */

(function () {
  "use strict";

  /**
   * Application name for logging and user messages
   */
  const APP_NAME = 'Portmarks';

  /**
   * Configuration constants for the bookmarklet.
   */
  const CONFIG = {
    // The maximum length of the filename including the extension.
    MAX_FILENAME_LENGTH: 150,

    // The file extension for portmark files.
    FILE_EXTENSION: '.portmark.html',

    // The maximum length of the base filename (without extension).
    get MAX_BASE_LENGTH() { 
      return this.MAX_FILENAME_LENGTH - this.FILE_EXTENSION.length;
    },

    // Default filename if URL parsing fails.
    FALLBACK_FILENAME: 'bookmark',

    // Character used to replace invalid filename characters.
    DELIMITER: '_',
  };

  /**
   * Sanitizes a filename by replacing invalid characters, thus ensuring it is safe for all
   * operating systems.
   *
   * @param {string} filename - The complete filename to sanitize.
   * @returns {string} - The sanitized filename safe for all operating systems.
   */
  function sanitizeFilename(filename) {
    return filename
      // Replace filesystem-invalid characters with delimiter
      .replace(/[<>:"|?*\\\/]/g, CONFIG.DELIMITER)
      // Replace control characters
      .replace(/[\x00-\x1f]/g, CONFIG.DELIMITER)
      // Replace whitespace with delimiter
      .replace(/\s+/g, CONFIG.DELIMITER)
      // Collapse multiple delimiters into single delimiter
      .replace(new RegExp(`\\${CONFIG.DELIMITER}+`, 'g'), CONFIG.DELIMITER)
      // Remove leading dots (hidden files on Unix)
      .replace(/^\./, CONFIG.DELIMITER)
      // Trim leading and trailing delimiters
      .replace(new RegExp(`^\\${CONFIG.DELIMITER}+|\\${CONFIG.DELIMITER}+$`, 'g'), '');
  }

  /**
   * Converts a URL to a safe filename using Chrome-style conversion.
   *
   * @param {string} url - The URL to convert to filename.
   * @returns {string} - A safe filename with a .portmark.html extension.
   */
  function urlToFilename(url) {
    try {
      const urlObj = new URL(url);

      // Build filename parts array with conditional query inclusion
      const parts = [
        urlObj.hostname,
        ...urlObj.pathname.split('/').filter(Boolean),
        ...(urlObj.search ? [urlObj.search.substring(1)] : [])
      ];

      // Join all components with delimiter
      let filename = parts.join(CONFIG.DELIMITER);

      // Apply single-pass sanitization to the complete filename
      filename = sanitizeFilename(filename);

      // Apply length limits with simple truncation
      if (filename.length > CONFIG.MAX_BASE_LENGTH) {
        filename = filename.substring(0, CONFIG.MAX_BASE_LENGTH - 3) + '...';
      }

      // Add the portmark extension
      return filename + CONFIG.FILE_EXTENSION;

    } catch (error) {
      console.error(`${APP_NAME}: URL parsing failed:`, error);
      return createFallbackFilename(url);
    }
  }

  /**
   * Creates a fallback filename when URL parsing fails.
   *
   * @param {string} url - The original URL (for domain extraction if possible).
   * @returns {string} - The fallback filename.
   */
  function createFallbackFilename(url) {
    try {
      // Try URL class parsing one more time (might work for simpler cases)
      const urlObj = new URL(url);
      const safeDomain = sanitizeFilename(urlObj.hostname);
      return safeDomain + CONFIG.FILE_EXTENSION;
    } catch (error) {
      // If URL class fails completely, use ultimate fallback
      return CONFIG.FALLBACK_FILENAME + CONFIG.FILE_EXTENSION;
    }
  }

  /**
   * Generates the HTML content for the portable bookmark and returns it as a Blob.
   *
   * @param {string} url - The URL to redirect to.
   * @returns {Blob} - Blob containing the complete HTML content.
   */
  function generatePortmark(url) {
    const htmlContent = `<html><head><meta http-equiv="refresh" content="0;url=${url}" /></head><body></body></html>`;
    return new Blob([htmlContent], { type: 'text/html' });
  }

  /**
   * Downloads a file using a blob and anchor element. This method is compatible with all modern
   * browsers and provides a simple way to trigger downloads.
   *
   * @param {Blob} blob - The blob to download.
   * @param {string} filename - The filename for the download.
   */
  function downloadFile(blob, filename) {
    try {
      const objectUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.style.display = 'none';

      // Add to DOM and trigger the download
      document.body.appendChild(anchor);
      anchor.click();

      // Clean up: remove the anchor and revoke the object URL
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      throw new Error('Failed to download file: ' + error.message);
    }
  }

  /**
   * The main function that orchestrates the portmark creation process.
   */
  function createPortmark() {
    try {
      // Get and validate the current page URL
      const currentUrl = window.location.href;

      // Generate a safe filename from the URL
      const filename = urlToFilename(currentUrl);

      // Create the portmark HTML content as a Blob and download it
      const blob = generatePortmark(currentUrl);
      downloadFile(blob, filename);

      // Log success for debugging
      console.log(`${APP_NAME}: Successfully created`, filename);

    } catch (error) {
      // Log detailed error information for developers
      console.error(`${APP_NAME} Error:`, error);

      // Show a simple alert to user
      alert(`${APP_NAME}: Failed to save bookmark.\n\n${error.message}`);
    }
  }

  // Execute the main function
  createPortmark();

})();