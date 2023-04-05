import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { constants } from './aria-dialog.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/us/en/skymiles/footer';
  let resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});
  let html = await resp.text();
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

  resp = await fetch('/us/en/skymiles/footer-search-dialog.plain.html');
  html = await resp.text();

  const searchForm = document.createElement('form');
  searchForm.classList.add('search-form');
  searchForm.innerHTML = `
    <label for="searchTerm">Search for topic…</label>
    <div class="field-group">
      <input id="searchTerm" name="searchTerm" type="search" placeholder="Search for topic…"/>
      <button aria-label="Submit Search" type="submit">
        <span class="icon icon-search"></span>
      </button>
    </div>`;
  searchForm.setAttribute('action', 'https://www.delta.com/site-search');
  searchForm.setAttribute('method', 'GET');

  const element = document.createElement(constants.tagName);
  element.innerHTML = searchHelpTopicsDiv.querySelector('.heading').outerHTML + html;
  element.setAttribute('modal', true);
  element.firstElementChild.nextElementSibling.prepend(searchForm);
  searchHelpTopicsDiv.querySelector('li').innerHTML = element.outerHTML;

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
  firstFooterDiv.role = 'navigation';
  firstFooterDiv.setAttribute('aria-label', 'Footer navigation');
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

  block.append(footer);
  decorateIcons(footer);
}
