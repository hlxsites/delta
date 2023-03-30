import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlock,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = ['banner']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function buildHeroBlock(main) {
  const firstHeading = main.querySelector('h1,h2');
  if (!firstHeading || !firstHeading.previousElementSibling) {
    return;
  }

  const elements = [];
  let sibling = firstHeading.previousElementSibling;
  while (sibling) {
    elements.push(sibling);
    sibling = sibling.previousElementSibling;
  }

  const section = document.createElement('div');
  section.append(buildBlock('hero', { elems: elements }));
  main.prepend(section);
}

function createA11yQuickNav(links = []) {
  const nav = document.createElement('nav');
  nav.classList.add('a11y-quicknav', 'sr-focusable');
  links.forEach((l) => {
    const a = document.createElement('a');
    a.href = `#${l.id}`;
    a.textContent = l.label;
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const el = document.getElementById(ev.currentTarget.href.split('#')[1]);
      el.setAttribute('tabindex', 0);
      el.focus();
      el.addEventListener('focusout', () => { el.setAttribute('tabindex', -1); }, { once: true });
    });
    nav.append(a);
  });
  document.body.prepend(nav);
}

function createResponsiveImage(pictures, breakpoint = 768) {
  pictures.sort((p1, p2) => {
    const img1 = p1.querySelector('img');
    const img2 = p2.querySelector('img');
    return img1.width < img2.width;
  });

  const responsivePicture = document.createElement('picture');
  const defaultImage = pictures[0].querySelector('img');

  responsivePicture.append(pictures[0].querySelector('source:not([media])'));
  responsivePicture.append(defaultImage);

  pictures[1].querySelectorAll('source[media]').forEach((e) => {
    e.setAttribute('media', `(min-width: ${breakpoint}px)`);
    responsivePicture.prepend(e);
  });

  // mark image as decorative if it doesn't have an alternative description
  if (!defaultImage.alt) {
    defaultImage.role = 'presentation';
    defaultImage.alt = '';
  }

  return responsivePicture;
}

function decorateResponsiveImages(container) {
  [...container.querySelectorAll('picture + picture, picture + br + picture')]
    .map((p) => p.parentElement)
    .filter((parent) => [...parent.children].every((c) => c.nodeName === 'PICTURE' || c.nodeName === 'BR'))
    .forEach((parent) => {
      const responsiveImage = createResponsiveImage([...parent.querySelectorAll('picture')]);
      parent.innerHTML = responsiveImage.outerHTML;
    });
}

async function decorateInlineToggles(container) {
  async function createInlineToggle(p) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.innerHTML = p.innerHTML;
    details.append(summary);
    if (p.nextElementSibling.children.length === 1 && p.nextElementSibling.firstElementChild.tagName === 'A') {
      const a = p.nextElementSibling.firstElementChild;
      try {
        const path1 = new URL(a.textContent).pathname;
        const path2 = new URL(a.href).pathname;
        if (path1 === path2) {
          // eslint-disable-next-line no-use-before-define
          const content = await fetchContent(path2);
          details.appendChild(content);
          details.querySelectorAll(':scope > div')
            .forEach(decorateBlock);
          p.nextElementSibling.remove();
          p.replaceWith(details);
          return;
        }
      } catch (err) {
        // Nothing to do here, just continue with regular decoration
      }
    }
    let next = p.nextElementSibling;
    while (next) {
      details.append(next);
      next = p.nextElementSibling;
    }
    p.replaceWith(details);
  }
  await Promise.all([...container.querySelectorAll('p:has(.icon-toggle:first-child)')]
    .map((el) => createInlineToggle(el)));
  await Promise.all([...container.querySelectorAll('p')]
    .filter((p) => p.textContent.startsWith('> '))
    .map((el) => createInlineToggle(el)));
}

// eslint-disable-next-line no-unused-vars
function decorateScreenReaderOnly(container) {
  [...container.querySelectorAll('del')].forEach((el) => {
    const span = document.createElement('span');
    span.classList.add('sr-only');
    span.innerHTML = el.innerHTML;
    el.replaceWith(span);
  });
}

function decorateHyperlinkImages(container) {
  [...container.querySelectorAll('picture + br + a')]
    .filter((a) => {
      try {
        return new URL(a.href).pathname === new URL(a.textContent).pathname;
      } catch (err) {
        return false;
      }
    })
    .forEach((a) => {
      const picture = a.previousElementSibling.previousElementSibling;
      picture.remove();
      a.previousElementSibling.remove();
      const oncle = a.parentElement.nextElementSibling;
      if (oncle.nextElementSibling === null
        && oncle.childElementCount === 1
        && oncle.firstElementChild.nodeName === 'A') {
        const figure = document.createElement('figure');
        figure.append(picture);
        const caption = document.createElement('figcaption');
        caption.innerHTML = oncle.firstElementChild.innerHTML;
        figure.append(caption);
        a.innerHTML = figure.outerHTML;
        oncle.remove();
      } else {
        a.innerHTML = picture.outerHTML;
      }
    });
}

export function decorateReferences(container) {
  const REFERENCE_TOKENS = /(\*+|[†‡¤]|\(\d+\))/g;
  [...container.querySelectorAll('p,a,li,h3,h4,h5,h6')]
    .forEach((el) => {
      el.innerHTML = el.innerHTML.replace(REFERENCE_TOKENS, (token) => `<sup>${token}</sup>`);
    });
  [...container.querySelectorAll('p')]
    .filter((p) => !p.classList.contains('button-container'))
    .filter((p) => p.children.length && [...p.children].every((c) => c.nodeName === 'EM' || (c.firstChild && c.firstChild.nodeName === 'EM')))
    .forEach((el) => {
      const small = document.createElement('small');
      small.innerHTML = el.innerHTML.replace(/<\\?em>/g, '');
      el.innerHTML = small.outerHTML;
    });
}

export async function decorateContainer(container) {
  decorateButtons(container);
  await decorateInlineToggles(container);
  decorateIcons(container);
  decorateResponsiveImages(container);
  decorateHyperlinkImages(container);
  decorateReferences(container);
  // decorateScreenReaderOnly(main);
}

export async function fetchContent(url) {
  try {
    const response = await fetch(`${url}.plain.html`);
    if (!response.ok) {
      Promise.reject(new Error(`${response.status} - ${response.statusText}`));
    }
    const html = await response.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    await decorateContainer(wrapper.firstElementChild);
    return wrapper.firstElementChild;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function decorateEyeBrows(main) {
  main.querySelectorAll('.default-content-wrapper').forEach((dcw) => {
    if (dcw.childElementCount > 1
      && ([...dcw.querySelectorAll('strong')].map((s) => s.textContent).join('') === dcw.textContent || dcw.querySelector('h1') !== null)) {
      dcw.classList.add('default-content-eyebrow');
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export async function decorateMain(main) {
  main.id = 'main';
  document.body.classList.add('fresh-air');
  createA11yQuickNav([
    { id: 'main', label: 'Skip to main content' },
  ]);
  await decorateContainer(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateEyeBrows(main);
  const badge = document.head.querySelector('meta[name="badge"]');
  if (badge) {
    const img = document.createElement('img');
    img.classList.add('badge');
    img.src = badge.content;
    main.querySelector('h2').append(img);
    main.classList.add('has-badge');
  }
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    await decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.ico`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
