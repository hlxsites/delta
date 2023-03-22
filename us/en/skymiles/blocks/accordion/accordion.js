import { decorateBlock, loadBlocks } from '../../scripts/lib-franklin.js';
import { fetchContent } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const accordions = [...block.children];
  accordions.forEach((accordion) => {
    accordion.classList.add('accordion-section');
  });

  const parents = block.querySelectorAll('.accordion-section');
  parents.forEach((({ children }) => {
    children[0].classList.add('header');
    if (children[0].querySelector(':scope > br ')) {
      const p = document.createElement('p');
      p.innerHTML = children[0].innerHTML;
      children[0].innerHTML = p.outerHTML;
    }
    children[0].setAttribute('aria-expanded', 'false');
    children[1].classList.add('text');
  }));

  const textDivs = block.querySelectorAll('.text');

  // fetch dynamic content
  let hasAsyncBlocks = false;
  await Promise.all([...textDivs].map(async (text) => {
    if (text.children.length === 1 && text.firstElementChild.tagName === 'A') {
      try {
        const path1 = new URL(text.firstElementChild.textContent).pathname;
        const path2 = new URL(text.firstElementChild.href).pathname;
        if (path1 !== path2) {
          return;
        }
        const content = await fetchContent(path2);
        text.classList.remove('button-container');
        text.innerHTML = '';
        text.appendChild(content);
        text.firstElementChild.querySelectorAll(':scope > div')
          .forEach(decorateBlock);
        hasAsyncBlocks = true;
      } catch (err) {
        text.parentElement.remove();
      }
    }
  }));
  if (hasAsyncBlocks) {
    await loadBlocks(document.querySelector('main'));
  }

  textDivs.forEach((text) => {
    const textButton = text.querySelectorAll('p > small > strong');
    textButton.forEach((tb) => {
      const button = document.createElement('button');
      button.textContent = tb.textContent;
      const p = tb.closest('p');
      p.parentNode.insertBefore(button, p);
      p.parentNode.removeChild(p);
    });
  });

  /* The with-controls variant adds expand/collapse all buttons */
  if (block.classList.contains('with-controls')) {
    // Create the toolbar div
    const toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');

    // Create the Expand All button
    const expandButton = document.createElement('button');
    expandButton.classList.add('tertiary');
    expandButton.classList.add('expand', 'highlight');
    expandButton.textContent = 'Expand All';
    toolbar.appendChild(expandButton);

    // Create the Collapse All button
    const collapseButton = document.createElement('button');
    collapseButton.classList.add('tertiary');
    collapseButton.classList.add('collapse');
    collapseButton.textContent = 'Collapse All';
    toolbar.appendChild(collapseButton);

    block.parentElement.insertBefore(toolbar, block);

    expandButton.addEventListener('click', () => {
      expandButton.classList.remove('highlight');
      collapseButton.classList.toggle('highlight');
      block.querySelectorAll('.header').forEach((header) => {
        header.setAttribute('aria-expanded', 'true');
      });
      block.querySelectorAll('.text').forEach((text) => {
        text.setAttribute('aria-expanded', 'true');
      });
    });

    collapseButton.addEventListener('click', () => {
      collapseButton.classList.remove('highlight');
      expandButton.classList.toggle('highlight');
      block.querySelectorAll('.header').forEach((header) => {
        header.setAttribute('aria-expanded', 'false');
      });
      block.querySelectorAll('.text').forEach((text) => {
        text.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // make content for accordion visible on header click
  const wrappers = block.querySelectorAll('.accordion-section');
  wrappers.forEach((wrapper) => {
    const headers = wrapper.querySelectorAll('.header');
    headers.forEach((header) => {
      const text = header.nextElementSibling;
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');
      text.setAttribute('aria-expanded', 'false');
      header.addEventListener('click', () => {
        const expanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', String(!expanded));
        text.setAttribute('aria-expanded', String(!expanded));
        headers.forEach((otherHeader) => {
          if (otherHeader !== header) {
            otherHeader.setAttribute('aria-expanded', 'false');
            otherHeader.classList.remove('clicked');
          }
        });
        header.classList.toggle('clicked');
      });
    });
  });
}
