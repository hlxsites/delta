import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { constants } from './aria-dialog.js';

const INLINE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1/siterestrict?fields=searchInformation(totalResults,formattedTotalResults),items(title,htmlTitle,link,snippet,htmlSnippet)&cx=d232b51a93511032c';
const INLINE_SEARCH_API_KEY = 'AIzaSyCVB0Y8AM7cMbWtVwTx2s02n4zymHrEFz8';

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
  element.innerHTML = `${searchHelpTopicsDiv.querySelector('.heading').outerHTML}<div>${html}</div>`;
  element.setAttribute('modal', true);
  element.firstElementChild.nextElementSibling.prepend(searchForm);
  searchHelpTopicsDiv.querySelector('li').innerHTML = element.outerHTML;

  const suggestions = document.createElement('div');
  suggestions.classList.add('search-suggestions');
  suggestions.setAttribute('role', 'region');
  suggestions.setAttribute('aria-live', 'polite');
  suggestions.style.display = 'none';
  searchHelpTopicsDiv.querySelector('hlx-aria-dialog > div').append(suggestions);

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
  firstFooterDiv.setAttribute('role', 'navigation');
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

  footer.querySelector('#searchTerm').addEventListener('input', async (ev) => {
    const popularTopics = document.querySelector('.search-form').nextElementSibling;
    const suggestionsList = document.querySelector('.search-suggestions');
    if (ev.currentTarget.value.length < 3) {
      popularTopics.style.display = '';
      suggestionsList.style.display = 'none';
      return;
    }
    popularTopics.style.display = 'none';
    suggestionsList.style.display = '';

    const reponse = await fetch(`${INLINE_SEARCH_URL}&key=${INLINE_SEARCH_API_KEY}&q=${ev.currentTarget.value}`);
    const json = await reponse.json();

    suggestionsList.innerHTML = '';
    if (!json.items || !json.items.length) {
      suggestionsList.innerHTML = '<div class="no-results"><span class="icon icon-search"></span>There are no matches for your search</div>';
      decorateIcons(suggestionsList);
      return;
    }

    const ul = document.createElement('ul');
    json.items.forEach((item) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.link;
      link.textContent = item.title;
      li.append(link);
      ul.append(li);
    });
    suggestionsList.append(ul);
  });
  decorateIcons(footer);
}
