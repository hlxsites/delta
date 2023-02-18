import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

const isDesktop = window.matchMedia('(min-width: 900px)');

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  // footer.id = 'footer';
  await decorateIcons(footer);
  block.append(footer);

  /**
 * Toggles all footer sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllFooterSections(sections, expanded = false) {
  sections.querySelectorAll('.footer > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

  // const footerSec = document.getElementsByClassName('.footer-wrapper');
  const footerSections = footer.querySelector('.footer');
  if (footerSections) {
    footerSections.querySelectorAll(':scope > ul > li').forEach((footerSection) => {
      if (footerSection.querySelector('ul')) footerSection.classList.add('footer-drop');
      footerSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = footerSection.getAttribute('aria-expanded') === 'true';
          toggleAllFooterSections(footerSections);
          footerSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }
}
