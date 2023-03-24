import {
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/lib-franklin.js';
// eslint-disable-next-line no-unused-vars
import HeaderApp from './header-app.js';

export async function decorateSectionNav(block) {
  const sectionNav = buildBlock('section-nav', '');
  block.append(sectionNav);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'section-nav-wrapper';
  navWrapper.append(sectionNav);
  block.append(navWrapper);

  decorateBlock(sectionNav);
  return loadBlock(sectionNav);
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.innerHTML = `<header-app basePath="${window.hlx.codeBasePath}"/>`;

  return Promise.all([
    // decorateTopHeader(block),
    decorateSectionNav(block),
  ]);
}
