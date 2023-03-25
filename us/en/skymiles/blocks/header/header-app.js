const CODE_BASE_PATH = '/us/en/skymiles';

function isDesktop() {
  return window.innerWidth >= 992;
}

async function animateToVisible(el, showHandler) {
  if (el.getAttribute('aria-hidden') === 'false') {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    el.setAttribute('aria-hidden', false);
    window.requestAnimationFrame(() => {
      showHandler();
      resolve();
    });
  });
}

async function animateToHidden(el, hideHandler) {
  if (el.getAttribute('aria-hidden') === 'true') {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.requestAnimationFrame(hideHandler);
    el.addEventListener('transitionend', () => {
      el.setAttribute('aria-hidden', true);
      resolve();
    }, { once: true });
  });
}

export default class HeaderComponent extends HTMLElement {
  static async getLibFranklin(codeBasePath) {
    const hostname = window.location.hostname === 'localhost'
      || window.location.hostname.endsWith('.hlx.page')
      || window.location.hostname.endsWith('.hlx.live')
      ? ''
      : 'https://main--delta--hlxsites.hlx.live';
    return import(`${hostname}${codeBasePath}/scripts/lib-franklin.js`);
  }

  static template() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>@import "${CODE_BASE_PATH}/styles/styles.css";</style>
      <style>@import "${CODE_BASE_PATH}/blocks/header/header-app.css";</style>
      <div class="header-wrapper">
        <div class="header-bar">
        </div>
        <div class="header-widgets">
          <div class="header-widget" id="header-book-widget"></div>
          <div class="header-widget" id="header-checkin-widget"></div>
          <div class="header-widget" id="header-mytrips-widget"></div>
          <div class="header-widget" id="header-flightstatus-widget"></div>
        </div>
      </div>`;
    return template.content;
  }

  constructor() {
    super();
    this.codeBasePath = this.getAttribute('basePath') || '';
    this.isDesktop = isDesktop();
  }

  async decorateButtonAnchors() {
    this.shadowRoot.querySelectorAll(':is(p,li)>a[href^="/#"]').forEach((a) => {
      const button = document.createElement('button');
      button.setAttribute('aria-controls', a.href.split('#')[1]);
      if (a.firstElementChild && a.firstElementChild.tagName === 'STRONG') {
        button.classList.add('cta');
        button.innerHTML = a.firstElementChild.innerHTML;
      } else if (a.firstElementChild && a.firstElementChild.tagName === 'EM') {
        button.classList.add('secondary');
        button.innerHTML = a.firstElementChild.innerHTML;
      } else {
        button.innerHTML = a.innerHTML;
      }
      if (a.parentElement.tagName === 'P') {
        a.parentElement.replaceWith(button);
      } else {
        a.replaceWith(button);
      }
    });
  }

  async decorateToggle() {
    const button = this.shadowRoot.querySelector('button');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !expanded);
      button.getAttribute('aria-controls').split(' ').forEach((id) => {
        const target = this.shadowRoot.getElementById(id);
        // Animate the menu
        if (expanded) {
          animateToHidden(target, () => { target.style.transform = 'translateX(-100%)'; });
        } else {
          animateToVisible(target, () => { target.style.transform = 'translateX(0)'; });
        }
      });
    });
  }

  async decorateTabs() {
    const tabs = this.shadowRoot.querySelector('.header-tabs');
    tabs.role = isDesktop() ? 'tablist' : 'toolbar';
    tabs.setAttribute('aria-orientation', isDesktop() ? 'horizontal' : 'vertical');
    tabs.querySelectorAll('button').forEach((tab) => {
      tab.tabindex = '-1';
      if (isDesktop()) {
        tab.role = 'tab';
      }
      tab.addEventListener('click', (ev) => {
        const id = ev.currentTarget.getAttribute('aria-controls');
        const el = this.shadowRoot.getElementById(id);
        const selected = ev.currentTarget.getAttribute('aria-selected') === 'true';
        this.hideAllTabs();
        this.hideAllMenus();
        ev.currentTarget.setAttribute('aria-selected', !selected);
        el.setAttribute('aria-hidden', selected);
      });
    });
  }

  async decorateMenus() {
    const menus = this.shadowRoot.querySelector('.header-menus');
    menus.role = 'menubar';
    menus.setAttribute('aria-orientation', isDesktop() ? 'horizontal' : 'vertical');
    menus.querySelectorAll('button').forEach((button) => {
      const item = document.createElement('div');
      button.setAttribute('aria-expanded', false);
      const wrapper = document.createElement('div');
      wrapper.id = button.getAttribute('aria-controls');
      wrapper.setAttribute('aria-hidden', true);
      if (!isDesktop()) {
        wrapper.style.maxHeight = 0;
      }
      wrapper.append(button.nextElementSibling);
      item.prepend(wrapper);
      button.replaceWith(item);
      const span = document.createElement('span');
      span.classList.add('icon');
      span.classList.add('icon-down-chevron');
      button.append(span);
      item.prepend(button);
      item.role = 'menuitem';
      item.tabindex = '-1';
      button.addEventListener('click', async () => {
        const id = button.getAttribute('aria-controls');
        const el = this.shadowRoot.getElementById(id);
        const expanded = button.getAttribute('aria-expanded') === 'true';
        this.hideAllTabs();
        await this.hideAllMenus();
        button.setAttribute('aria-expanded', !expanded);
        if (isDesktop()) {
          el.setAttribute('aria-hidden', expanded);
          return;
        }
        // Animate the menu
        if (expanded) {
          animateToHidden(el, () => { el.style.maxHeight = 0; });
        } else {
          animateToVisible(el, () => {
            const list = el.firstElementChild;
            const items = list.querySelectorAll('li li');
            el.style.maxHeight = `${items.length * items[0].getBoundingClientRect().height}px`;
          });
        }
      });
    });
    this.lib.decorateIcons(menus);
  }

  async decorateWidgets() {
    const widgets = this.shadowRoot.querySelectorAll('.header-widget');
    return Promise.all([...widgets].map(async (widget) => {
      widget.role = isDesktop() ? 'tabpanel' : 'dialog';
      widget.setAttribute('aria-hidden', true);
      const button = document.createElement('button');
      button.classList.add('header-widget-close');
      button.innerHTML = '<span class="icon icon-x"></span>';
      button.addEventListener('click', () => {
        widget.setAttribute('aria-hidden', true);
        this.shadowRoot.querySelector(`[aria-controls*="${widget.id}"]`).setAttribute('aria-hidden', false);
      });
      widget.prepend(button);
      await this.lib.decorateIcons(button);
    }));
  }

  hideAllTabs() {
    this.shadowRoot.querySelectorAll('.header-tabs button').forEach((button) => {
      button.setAttribute('aria-selected', false);
    });
    this.shadowRoot.querySelectorAll('.header-widget').forEach((widget) => {
      widget.setAttribute('aria-hidden', true);
    });
  }

  async hideAllMenus() {
    this.shadowRoot.querySelectorAll('.header-menus button[aria-expanded="true"]').forEach((ul) => {
      ul.setAttribute('aria-expanded', false);
    });
    const menus = this.shadowRoot.querySelectorAll('.header-menus div[aria-hidden="false"]');
    if (!menus.length) {
      return Promise.resolve();
    }
    if (isDesktop()) {
      menus.forEach((el) => {
        el.setAttribute('aria-hidden', true);
      });
      return Promise.resolve();
    }
    return Promise.all([...menus]
      .map((el) => animateToHidden(el, () => { el.style.maxHeight = 0; })));
  }

  async loadEager() {
    const response = await fetch('/drafts/julien/nav.plain.html');
    const content = await response.text();
    const wrapper = this.shadowRoot.querySelector('.header-wrapper');
    wrapper.style.visibility = 'hidden';
    this.shadowRoot.querySelector('.header-bar').innerHTML = content;
    const sections = ['toggle', 'brand', 'tabs', 'menus', 'help', 'tools'];
    [...this.shadowRoot.querySelector('.header-bar').children].forEach((el, i) => {
      el.classList.add(`header-${sections[i]}`);
      el.id = `header-${sections[i]}`;
    });
    const links = document.createElement('div');
    links.id = 'header-links';
    links.classList.add('header-links');
    links.setAttribute('aria-hidden', !isDesktop());
    links.append(this.shadowRoot.querySelector('.header-brand'));
    links.append(this.shadowRoot.querySelector('.header-tabs'));
    links.append(this.shadowRoot.querySelector('.header-menus'));
    links.append(this.shadowRoot.querySelector('.header-help'));

    this.shadowRoot.querySelector('.header-bar').insertBefore(links, this.shadowRoot.querySelector('.header-tools'));
    await this.lib.decorateIcons(this.shadowRoot);
    await this.decorateButtonAnchors();
    wrapper.style.visibility = 'visible';
  }

  async loadLazy() {
    await this.decorateToggle();
    await this.decorateTabs();
    await this.decorateMenus();
    await this.decorateWidgets();
    await this.lib.decorateButtons(this.shadowRoot);
  }

  // eslint-disable-next-line class-methods-use-this
  async loadDelayed() {
    // Nothing here yet
  }

  attachListeners() {
    window.addEventListener('resize', async () => {
      const shouldDesktop = isDesktop();
      this.hideAllTabs();
      await this.hideAllMenus();
      if (this.isDesktop !== shouldDesktop) {
        this.isDesktop = shouldDesktop;

        const toggle = this.shadowRoot.querySelector('.header-toggle > button');
        toggle.setAttribute('aria-expanded', false);

        const links = this.shadowRoot.querySelector('.header-links');
        links.setAttribute('aria-hidden', !shouldDesktop);
        links.style.transform = shouldDesktop ? 'none' : 'translateX(-100%)';

        const tabs = this.shadowRoot.querySelector('.header-tabs');
        tabs.role = shouldDesktop ? 'tablist' : 'toolbar';
        tabs.setAttribute('aria-orientation', shouldDesktop ? 'horizontal' : 'vertical');
        tabs.querySelectorAll(':scope > button').forEach((b) => {
          b.role = shouldDesktop ? 'tab' : 'button';
        });
        this.shadowRoot.querySelectorAll('.header-widget').forEach((div) => {
          div.role = shouldDesktop ? 'tabpanel' : 'dialog';
        });

        const menus = this.shadowRoot.querySelector('.header-menus');
        menus.setAttribute('aria-orientation', shouldDesktop ? 'horizontal' : 'vertical');
        menus.querySelectorAll(':scope > [role="menuitem"] > [aria-hidden]').forEach((div) => {
          div.style.maxHeight = shouldDesktop ? 'none' : '0px';
        });
      }
    }, { passive: true });
  }

  async connectedCallback() {
    this.lib = await HeaderComponent.getLibFranklin(this.codeBasePath);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(HeaderComponent.template({}).cloneNode(true));
    await this.loadEager();
    await this.loadLazy();
    this.attachListeners();
    setTimeout(() => {
      this.loadDelayed();
    }, 3000);
  }
}

customElements.define('header-app', HeaderComponent);
