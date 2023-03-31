import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/us/en/skymiles/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;

  const styles = ['search-help-topics', 'links', 'copyright', 'legal', 'feedback', 'social-int'];
  styles.forEach((style, i) => {
    if (footer.children[i]) {
      footer.children[i].classList.add(`footer-${style}`);
    }
  });

  const searchHelpTopicsDiv = footer.querySelector('.footer-search-help-topics');
  const searchPlaceholder = searchHelpTopicsDiv.querySelectorAll('ul > li > strong');
  searchPlaceholder.forEach((div) => {
    div.className = 'heading';
  });

  const rowNames = ['first-row', 'second-row'];
  const searchRows = footer.querySelectorAll('.footer-search-help-topics > ul > li');
  searchRows.forEach((div, i) => {
    div.className = rowNames[i];
  });

  const footerSocialInt = footer.querySelector('.footer-social-int');
  const searchSocialInt = footerSocialInt.querySelectorAll('ul > li');
  searchSocialInt.forEach((div, i) => {
    if (i === 0) {
      div.querySelectorAll('a').forEach((a) => {
        const product = a.querySelector('.icon').classList.item(1).split('-')[1];
        a.setAttribute('aria-label', `Go to our ${product} page.`);
      });
    }
    if (div !== footerSocialInt.querySelector('ul > li:first-child')) {
      div.className = 'color';
    }
  });

  const firstFooterDiv = footer.querySelector('.footer-links');
  firstFooterDiv.classList.add('footer-menu');
  const headings = firstFooterDiv.querySelectorAll('ul > li > strong');
  headings.forEach((div) => {
    div.classList.add('heading');
  });

  const menu = firstFooterDiv.querySelectorAll('ul > li > ul');
  menu.forEach((div) => {
    div.classList.add('menu');
  });

  const menuHeadings = footer.querySelectorAll('.heading');
  const menuLists = footer.querySelectorAll('.menu');
  menuHeadings.forEach((heading) => {
    heading.addEventListener('click', () => {
      const menuList = heading.nextElementSibling;
      const isMenuListExpanded = menuList.getAttribute('aria-expanded') === 'true';
      if (menuList && menuList.classList.contains('menu')) {
        heading.setAttribute('aria-expanded', 'false');
        menuList.setAttribute('aria-expanded', 'false');
        menuLists.forEach((ul) => {
          if (ul !== menuList && ul.getAttribute('aria-expanded') === 'true') {
            ul.previousElementSibling.setAttribute('aria-expanded', 'false');
            ul.setAttribute('aria-expanded', 'false');
          }
        });
        heading.setAttribute('aria-expanded', !isMenuListExpanded);
        menuList.setAttribute('aria-expanded', !isMenuListExpanded);
      }
    });
  });

  decorateIcons(footer);
  block.append(footer);
}
