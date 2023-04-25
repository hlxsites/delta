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
  const REFERENCE_TOKENS = /(\*+|[†‡¤]|\(\d+\))/g;
  [...container.querySelectorAll('p,a,li,h3,h4,h5,h6')]
    .forEach((el) => {
      if (el.innerHTML.match(REFERENCE_TOKENS)) {
        el.innerHTML = el.innerHTML.replace(REFERENCE_TOKENS, (token) => `<sup>${token}</sup>`);
      }
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
    img.role = 'presentation';
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
    img.role = 'presentation';
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

  // eslint-disable-next-line
  !function(a){var e="https://s.go-mpulse.net/boomerang/",t="addEventListener";if("False"=="True")a.BOOMR_config=a.BOOMR_config||{},a.BOOMR_config.PageParams=a.BOOMR_config.PageParams||{},a.BOOMR_config.PageParams.pci=!0,e="https://s2.go-mpulse.net/boomerang/";if(window.BOOMR_API_key="PWV8J-R2M7Y-67AAN-EA9TD-6DRAX",function(){function n(e){a.BOOMR_onload=e&&e.timeStamp||(new Date).getTime()}if(!a.BOOMR||!a.BOOMR.version&&!a.BOOMR.snippetExecuted){a.BOOMR=a.BOOMR||{},a.BOOMR.snippetExecuted=!0;var i,_,o,r=document.createElement("iframe");if(a[t])a[t]("load",n,!1);else if(a.attachEvent)a.attachEvent("onload",n);r.src="javascript:void(0)",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="width:0;height:0;border:0;display:none;",o=document.getElementsByTagName("script")[0],o.parentNode.insertBefore(r,o);try{_=r.contentWindow.document}catch(O){i=document.domain,r.src="javascript:var d=document.open();d.domain='"+i+"';void(0);",_=r.contentWindow.document}_.open()._l=function(){var a=this.createElement("script"),BOOMR_lstart=(new Date).getTime();if(i)this.domain=i;a.id="boomr-if-as",a.src=e+"PWV8J-R2M7Y-67AAN-EA9TD-6DRAX",this.body.appendChild(a)},_.write("<bo"+'dy onload="document._l();">'),_.close()}}(),"".length>0)if(a&&"performance"in a&&a.performance&&"function"==typeof a.performance.setResourceTimingBufferSize)a.performance.setResourceTimingBufferSize();!function(){if(BOOMR=a.BOOMR||{},BOOMR.plugins=BOOMR.plugins||{},!BOOMR.plugins.AK){var e="true"=="true"?1:0,t="",n="dal7v5limbw6gzbmx3nq-f-30c6cc913-clientnsv4-s.akamaihd.net",i="false"=="true"?2:1,_={"ak.v":"34","ak.cp":"542018","ak.ai":parseInt("237743",10),"ak.ol":"0","ak.cr":28,"ak.ipv":4,"ak.proto":"h2","ak.rid":"1a3aa1e5","ak.r":29077,"ak.a2":e,"ak.m":"x","ak.n":"essl","ak.bpcip":"24.23.250.0","ak.cport":51778,"ak.gh":"23.197.50.223","ak.quicv":"","ak.tlsv":"tls1.3","ak.0rtt":"","ak.csrc":"-","ak.acc":"","ak.t":"1680654043","ak.ak":"hOBiQwZUYzCg5VSAfCLimQ==Fwry4itwy7y18DDollG4VWlKvUUEG+2sjUWZwOELYsoaPxqLEmJ4rFh8MhTCJUVw5pNFwBM14XZlV+2Xf3NDWcChNfMXEcU7T0BydztDejUsbL9bNbzUvap/6xr/KL/zA+PliOtDBwO1od7RrFLpK8yl5C5Y7YLd7vxMrHsdN9w6KUWgr3sYgtUPFGY9h3Vafvy6Ytt+8H+N9wlv3hCEVpHPJwC4WniUU5m1AiXN8uqYzd/XpB0gSX+4fNzNo92KYT5LRrUlCieGLnbVRyml/bAMxWcX2PwsvvZY4+n6VVA4ncMyFEbTHyXtF4YlFFfqfbGKskEeznEe3zF5p/ug2hOkeT6LeWvaaEjilTzoFylE2jTIKfBaFG9SJm+IYt7gu3Vk26fqdWifAKYB4rwboGdz/Suhd+Wa+wQUX78R9m8=","ak.pv":"198","ak.dpoabenc":"","ak.tf":i};if(""!==t)_["ak.ruds"]=t;var o={i:!1,av:function(e){var t="http.initiator";if(e&&(!e[t]||"spa_hard"===e[t]))_["ak.feo"]=void 0!==a.aFeoApplied?1:0,BOOMR.addVar(_)},rv:function(){var a=["ak.bpcip","ak.cport","ak.cr","ak.csrc","ak.gh","ak.ipv","ak.m","ak.n","ak.ol","ak.proto","ak.quicv","ak.tlsv","ak.0rtt","ak.r","ak.acc","ak.t","ak.tf"];BOOMR.removeVar(a)}};BOOMR.plugins.AK={akVars:_,akDNSPreFetchDomain:n,init:function(){if(!o.i){var a=BOOMR.subscribe;a("before_beacon",o.av,null,null),a("onbeacon",o.rv,null,null),o.i=!0}return this},is_complete:function(){return!0}}}}()}(window);
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
