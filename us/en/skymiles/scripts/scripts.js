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

  pictures[1].querySelectorAll('source[media]').forEach((e) => {
    e.setAttribute('media', `(min-width: ${breakpoint}px)`);
    responsivePicture.append(e);
  });

  const defaultImage = pictures[0].querySelector('img');
  responsivePicture.append(pictures[0].querySelector('source:not([media])'));
  responsivePicture.append(defaultImage);

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
    summary.querySelector('.icon-toggle').remove();
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
  await Promise.all([...container.querySelectorAll('p')]
    .filter((p) => !!p.querySelector('.icon-toggle:first-child'))
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

function decorateFigures(container) {
  [...container.querySelectorAll('picture')].forEach((picture) => {
    if (picture.closest('figure')) {
      return;
    }
    const oncle1 = picture.parentElement.querySelector('picture + br + a')
      || picture.parentElement.nextElementSibling;
    if (!oncle1 || (oncle1.tagName !== 'P' && oncle1.tagName !== 'A')) {
      return;
    }
    const oncle2 = oncle1.tagName === 'A' ? oncle1.parentElement.nextElementSibling : oncle1.nextElementSibling;
    if (oncle2 && oncle1.tagName !== 'A' && (!oncle1.classList.contains('button-container') || oncle2.nextElementSibling)) {
      return;
    }
    if (oncle2 && oncle2.classList.contains('button-container') && (
      (oncle1.href !== oncle2.querySelector('a').href)
      || (oncle1.tagName !== 'A' && oncle1.querySelector('a').href !== oncle2.querySelector('a').href)
    )) {
      return;
    }

    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    if (oncle2) {
      const isOncle2Link = oncle2.classList.contains('button-container');
      caption.innerHTML = isOncle2Link
        ? oncle2.querySelector('a').innerHTML
        : oncle2.innerHTML;
      oncle1.innerHTML = '';
      oncle2.remove();
      if (isOncle2Link) {
        oncle1.append(figure);
        figure.append(picture);
      } else {
        oncle1.append(picture);
        figure.innerHTML = oncle1.outerHTML;
        oncle1.replaceWith(figure);
      }
      figure.append(caption);
    } else if (oncle1.classList.contains('button-container') && !oncle1.textContent.match(/https?:\/\//)) {
      caption.innerHTML = oncle1.querySelector('a').innerHTML;
      figure.append(picture);
      figure.append(caption);
      oncle1.querySelector('a').innerHTML = figure.outerHTML;
    } else if (oncle1.classList.contains('button-container')) {
      oncle1.innerHTML = '';
      oncle1.append(picture);
    } else {
      caption.innerHTML = oncle1.innerHTML;
      figure.append(picture);
      figure.append(caption);
      oncle1.innerHTML = '';
      oncle1.append(figure);
    }
    if (oncle1.tagName !== 'A') {
      oncle1.previousElementSibling.remove();
    }
  });
}

export function decorateReferences(container) {
  const REFERENCE_TOKENS = /(?!<sup>)(\*+|[†‡¤]|\(\d+\))/g;
  [...container.querySelectorAll('p,a,li,h3,h4,h5,h6')]
    .forEach((el) => {
      if (!el.querySelector('sup') && el.innerHTML.match(REFERENCE_TOKENS)) {
        el.innerHTML = el.innerHTML.replace(REFERENCE_TOKENS, (token) => `<sup>${token}</sup>`);
      }
    });
  [...container.querySelectorAll('p')]
    .filter((p) => !p.classList.contains('button-container') && !p.querySelector('.button'))
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
  decorateFigures(container);
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
      && ([...dcw.querySelectorAll('strong')].map((s) => s.textContent).join('') === dcw.textContent)) {
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
  main.classList.add('skymiles');
  // mark image as decorative if it doesn't have an alternative description
  document.querySelectorAll('img:not([alt],img[alt=""]').forEach((img) => {
    img.setAttribute('role', 'presentation');
    img.alt = ' ';
  });
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
    img.setAttribute('role', 'presentation');
    img.alt = '';
    main.querySelector('h2').append(img);
    main.classList.add('has-badge');
  }
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  const lang = document.querySelector('head>meta[name="lang"]');
  document.documentElement.lang = lang ? lang.content : 'en';
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

const hreflangMap = {
  'it-IT': 'https://it.delta.com/eu/it',
  'de-DE': 'https://de.delta.com/eu/de',
  'en-CA': 'https://www.delta.com/ca/en',
  'pt-BR': 'https://pt.delta.com/br/pt',
  'ko-KR': 'https://ko.delta.com/kr/ko',
  'fr-FR': 'https://fr.delta.com/fr/fr',
  'zh-CN': 'https://zh.delta.com/cn/zh',
  'es-MX': 'https://es.delta.com/mx/es',
  'ja-JP': 'https://ja.delta.com/jp/ja',
  'en-GB': 'https://www.delta.com/gb/en',
  'fr-CA': 'https://fr.delta.com/ca/fr',
  'x-default': 'https://www.delta.com',
};

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
  createA11yQuickNav([
    { id: 'main', label: 'Skip to main content' },
  ]);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.ico`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  Object.entries(hreflangMap).forEach(([key, value]) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', key);
    link.setAttribute('href', `${value}${window.location.pathname.replace(/\/us\/en/, '')}`);
    document.head.appendChild(link);
  });
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
