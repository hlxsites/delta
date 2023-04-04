import { decorateBlock, loadBlocks } from '../../scripts/lib-franklin.js';
import { fetchContent } from '../../scripts/scripts.js';
import { constants } from './aria-tabs.js';

export default async function decorate(block) {
  const element = document.createElement(constants.tagName);
  element.innerHTML = block.innerHTML;
  block.innerHTML = '';
  block.append(element);

  element.querySelector('[role="tablist"]').classList.add('tab-buttons');
  element.querySelectorAll('[role="tab"]').forEach((el) => {
    el.classList.add('tab-button');
  });
  const panels = block.querySelectorAll('[role="tabpanel"]');
  panels.forEach((el) => el.classList.add('tab-panel'));

  // fetch dynamic content
  let hasAsyncBlocks = false;
  await Promise.all([...panels].map(async (panel) => {
    if (panel.children.length === 1 && panel.firstElementChild.classList.contains('button-container')) {
      panel.parentElement.setAttribute('aria-live', 'off');
      try {
        const path1 = new URL(panel.querySelector('.button').textContent).pathname;
        const path2 = new URL(panel.querySelector('.button').href).pathname;
        if (path1 !== path2) {
          return;
        }
        const content = await fetchContent(path2);
        panel.innerHTML = '';
        panel.appendChild(content);
        panel.querySelectorAll(':scope > div')
          .forEach(decorateBlock);
        hasAsyncBlocks = true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Could not load tab content.', err);
      }
    }
  }));
  if (hasAsyncBlocks) {
    await loadBlocks(document.querySelector('main'));
  }
}
