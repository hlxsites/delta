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
  searchPlaceholder.forEach((div, i) => {
    div.className = 'heading';
  });

  const rowNames = ['first-row', 'second-row'];
  const searchRows = footer.querySelectorAll('.footer-search-help-topics > ul > li');
  searchRows.forEach((div, i) => {
    div.className = rowNames[i];
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
  menuHeadings.forEach((heading, index) => {
    const caret = document.createElement('span');
    caret.classList.add('caret');
    caret.innerHTML = '&#8964;';
    heading.appendChild(caret);
    heading.addEventListener('click', () => {
      const menuList = menuLists[index];
      const isMenuListVisible = menuList.classList.contains('show');
      menuLists.forEach((ul) => {
        if (ul !== menuList && ul.classList.contains('show')) {
          ul.classList.remove('show');
          ul.previousElementSibling.querySelector('.caret').classList.remove('up');
        }
      });

      if (!isMenuListVisible) {
        menuList.classList.add('show');
        caret.classList.add('up');
      } else {
        menuList.classList.remove('show');
        caret.classList.remove('up');
      }
    });
  });

  decorateIcons(footer);
  block.append(footer);
}
