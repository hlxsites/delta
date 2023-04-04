import { decorateBlock, loadBlocks } from '../../scripts/lib-franklin.js';
import { fetchContent } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const tabs = [...block.children];
  tabs.forEach((tab) => {
    tab.classList.add('tab-section');
  });

  // const parents = block.querySelectorAll('.tab-section');
  // parents.forEach((({ children }) => {
  //   children[0].classList.add('header');
  //   if (children[0].querySelector(':scope > br ')) {
  //     const p = document.createElement('p');
  //     p.innerHTML = children[0].innerHTML;
  //     children[0].innerHTML = p.outerHTML;
  //   }
  //   children[0].setAttribute('aria-expanded', 'false');
  //   children[1].classList.add('text');
  // }));

  // create a container for the menus
  // iterate over everything from line 5 
  // for every row will have 2 children (line 11) 
  // append child 0 to the container
  // pre-pend the container to the block

  // create a container for the tab menus
  const parents = block.querySelectorAll('.tab');
  const tabMenuContainer = document.createElement('div');
  tabMenuContainer.classList.add('tab-menu-container');
  // parents.forEach((parent) => {
  //   const header = parent.querySelector('.header');
  //   tabMenuContainer.appendChild(header);
  // });
  
    parents.forEach((({ children }) => {
      children[0].classList.add('header');
      if (children[0].querySelector(':scope > br ')) {
        const p = document.createElement('p');
        p.innerHTML = children[0].innerHTML;
        children[0].innerHTML = p.outerHTML;
      }
      // children[0].setAttribute('aria-expanded', 'false');
      // children[1].classList.add('text');
      tabMenuContainer.appendChild(children[0]);
  
    }));

  block.prepend(tabMenuContainer);
  
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
          // eslint-disable-next-line no-console
          console.error('Could not load accordion content.', err);
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
  

  // make content for tab visible on header click
  const wrappers = block.querySelectorAll('.tab-section');
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

  // add and remove active class to show one tab at a time
  const tabMenuItems = block.querySelectorAll('.tab-section');
  tabMenuItems[0].classList.add('active');

  const tabContentItems = block.querySelectorAll('.tab-section > .text');
  tabContentItems[0].classList.add('active');

  tabMenuItems.forEach((tabMenuItem, index) => {
    tabMenuItem.addEventListener('click', () => {
      tabMenuItems.forEach((tabMenuItem) => {
        tabMenuItem.classList.remove('active');
      });
      tabContentItems.forEach((tabContentItem) => {
        tabContentItem.classList.remove('active');
      });

      tabMenuItem.classList.add('active');
      tabContentItems[index].classList.add('active');
    });
  });
}