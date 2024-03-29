import { decorateBlock, loadBlocks } from '../../scripts/lib-franklin.js';
import { decorateContainer, fetchContent } from '../../scripts/scripts.js';
import { constants } from './aria-accordion.js';

export default async function decorate(block) {
  const accordions = [...block.children];
  accordions.forEach((accordion) => {
    accordion.classList.add('accordion-section');
    accordion.firstElementChild.classList.add('header');
    if (accordion.firstElementChild.querySelector('br')) {
      accordion.firstElementChild.classList.add('is-multiline');
    }
    accordion.firstElementChild.nextElementSibling.classList.add('text');
  });

  const element = document.createElement(constants.tagName);
  element.setAttribute(constants.withControls, block.classList.contains('with-controls'));
  element.innerHTML = block.innerHTML;
  block.innerHTML = '';
  block.append(element);
  block.querySelectorAll('p:empty').forEach((el) => el.remove());

  const textDivs = block.querySelectorAll('.text');

  // fetch dynamic content
  let hasAsyncBlocks = false;
  await Promise.all([...textDivs].map(async (text) => {
    text.parentElement.setAttribute('aria-live', 'off');
    if (text.children.length === 1 && text.firstElementChild.tagName === 'A') {
      let path;
      try {
        const path1 = new URL(text.firstElementChild.textContent).pathname;
        const path2 = new URL(text.firstElementChild.href).pathname;
        if (path1 !== path2) {
          return;
        }
        path = path2;
      } catch (err) {
        // Invalid url, do nothing
      }
      if (!path) {
        return;
      }
      try {
        const content = await fetchContent(path);
        text.classList.remove('button-container');
        text.innerHTML = '';
        text.appendChild(content);
        text.firstElementChild.querySelectorAll(':scope > div')
          .forEach(decorateBlock);
        hasAsyncBlocks = true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Could not load accordion content.', err);
        text.parentElement.remove();
      }
    }
  }));
  if (hasAsyncBlocks) {
    await loadBlocks(document.querySelector('main'));
  }

  return Promise.all([...textDivs].map((el) => decorateContainer(el)));
}
