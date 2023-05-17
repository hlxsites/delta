/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

const tableToTableBlock = (main, document) => {
  const tables = main.querySelectorAll('table');
  tables.forEach((table) => {
    const thead = table.querySelector('thead');
    if (thead) {
      const ths = thead.querySelectorAll('th');
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.setAttribute('colspan', ths.length);
      th.innerHTML = 'Table';
      tr.append(th);
      thead.prepend(tr);
    }
  });
};

const anchorLinksToTOCBlock = (main, document) => {
  const anchors = main.querySelectorAll('.anchor-link');
  anchors.forEach((anchor) => {
    const toc = WebImporter.DOMUtils.createTable([['TOC']], document);
    anchor.replaceWith(toc);
  });
};

const convertSpanToImg = (main, document) => {
  main.querySelectorAll('span[data-src]').forEach((span) => {
    const img = document.createElement('img');
    img.src = `http:${span.dataset.src}`;
    span.replaceWith(img);
  });
};

export default {
  preprocess({ document }) {
    convertSpanToImg(document.body, document);
  },

  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      '#skip-content',
      '.d-none',
      '.inspire-sub-nav',
      '.sr-only',
      '#sk-sub-navigation',
      '.sk-subnav',
    ]);

    // create the metadata block and append it to the main element
    createMetadata(main, document);

    anchorLinksToTOCBlock(main, document);
    tableToTableBlock(main, document);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
