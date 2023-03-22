const CODE_BASE_PATH = '/us/en/skymiles';

function animateToVisible(el, visible, showHandler, hideHandler) {
  // Animate the menu
  if (visible) {
    window.requestAnimationFrame(hideHandler);
    el.addEventListener('transitionend', () => {
      el.setAttribute('aria-hidden', true);
    }, { once: true });
  } else {
    el.setAttribute('aria-hidden', false);
    window.requestAnimationFrame(showHandler);
  }
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

  static #template() {
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
  }

  async #decorateButtonAnchors() {
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

  async #decorateToggle() {
    const button = this.shadowRoot.querySelector('button');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !expanded);
      button.getAttribute('aria-controls').split(' ').forEach((id) => {
        const target = this.shadowRoot.getElementById(id);
        // Animate the menu
        animateToVisible(
          target,
          expanded,
          () => { target.style.transform = 'translateX(0)'; },
          () => { target.style.transform = 'translateX(-100%)'; },
        );
      });
    });
  }

  async #decorateTabs() {
    const tabs = this.shadowRoot.querySelector('.header-tabs');
    tabs.role = 'toolbar';
    tabs.setAttribute('aria-orientation', 'vertical');
    tabs.querySelectorAll('button').forEach((tab) => {
      // tab.role = 'tab';
      // tab.setAttribute('aria-selected', 'false');
      tab.tabindex = '-1';
      tab.addEventListener('click', (ev) => {
        const id = ev.currentTarget.getAttribute('aria-controls');
        const el = this.shadowRoot.getElementById(id);
        const selected = ev.currentTarget.getAttribute('aria-selected') === 'true';
        el.setAttribute('aria-hidden', selected);
      });
    });
  }

  async #decorateMenus() {
    const menus = this.shadowRoot.querySelector('.header-menus');
    menus.role = 'menubar';
    menus.setAttribute('aria-orientation', 'vertical');
    menus.querySelectorAll('button').forEach((button) => {
      const item = document.createElement('div');
      button.setAttribute('aria-expanded', false);
      button.nextElementSibling.id = button.getAttribute('aria-controls');
      button.nextElementSibling.setAttribute('aria-hidden', true);
      button.nextElementSibling.style.maxHeight = 0;
      item.prepend(button.nextElementSibling);
      button.replaceWith(item);
      const span = document.createElement('span');
      span.classList.add('icon');
      span.classList.add('icon-down-chevron');
      button.append(span);
      item.prepend(button);
      item.role = 'menuitem';
      item.tabindex = '-1';
      button.addEventListener('click', () => {
        const id = button.getAttribute('aria-controls');
        const el = this.shadowRoot.getElementById(id);
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);
        // Animate the menu
        animateToVisible(
          el,
          expanded,
          () => { el.style.maxHeight = `${el.childElementCount * el.firstElementChild.getBoundingClientRect().height}px`; },
          () => { el.style.maxHeight = 0; },
        );
      });
    });
    this.lib.decorateIcons(menus);
  }

  async #decorateWidgets() {
    const widgets = this.shadowRoot.querySelectorAll('.header-widget');
    return Promise.all([...widgets].map(async (widget) => {
      widget.role = 'dialog';
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

  async connectedCallback() {
    this.lib = await HeaderComponent.getLibFranklin(this.codeBasePath);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(HeaderComponent.#template({}).cloneNode(true));
    await this.loadEager();
    await this.loadLazy();
    setTimeout(() => {
      this.loadDelayed();
    }, 3000);
  }

  async loadEager() {
    const response = await fetch('/drafts/julien/nav.plain.html');
    const content = await response.text();
    this.shadowRoot.querySelector('.header-bar').innerHTML = content;
    const sections = ['toggle', 'brand', 'tabs', 'menus', 'help', 'tools'];
    [...this.shadowRoot.querySelector('.header-bar').children].forEach((el, i) => {
      el.classList.add(`header-${sections[i]}`);
      el.id = `header-${sections[i]}`;
    });
    const links = document.createElement('div');
    links.id = 'header-links';
    links.classList.add('header-links');
    links.setAttribute('aria-hidden', true);
    links.append(this.shadowRoot.querySelector('.header-brand'));
    links.append(this.shadowRoot.querySelector('.header-tabs'));
    links.append(this.shadowRoot.querySelector('.header-menus'));
    links.append(this.shadowRoot.querySelector('.header-help'));

    this.shadowRoot.querySelector('.header-bar').insertBefore(links, this.shadowRoot.querySelector('.header-tools'));
    await this.lib.decorateIcons(this.shadowRoot);
    await this.#decorateButtonAnchors();
  }

  async loadLazy() {
    await this.#decorateToggle();
    await this.#decorateTabs();
    await this.#decorateMenus();
    await this.#decorateWidgets();
    await this.lib.decorateButtons(this.shadowRoot);
  }

  // eslint-disable-next-line class-methods-use-this
  async loadDelayed() {
    // Nothing here yet
  }
}

customElements.define('header-app', HeaderComponent);
