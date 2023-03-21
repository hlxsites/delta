const CODE_BASE_PATH = '/us/en/skymiles';

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
    template.innerHTML = `<style>@import "${CODE_BASE_PATH}/styles/styles.css";</style>
<style>@import "${CODE_BASE_PATH}/blocks/header/header-app.css";</style>
<div class="header-wrapper">
  <div class="header-bar">
    <div class="header-toggle">
      <button aria-expanded="false" aria-controls="header-links"><span class="icon icon-3line"/></button>
    </div>
    <div id="header-links" class="header-links" aria-hidden="true">
      <div class="header-brand">
        <a class="button" href="/">Home</a>
      </div>
      <div role="tablist" class="header-tabs">
        <button aria-controls="header-book-widget">Book</button>
        <button aria-controls="header-checkin-widget">Check-In</button>
        <button aria-controls="header-mytrips-widget">My Trips</button>
        <button aria-controls="header-flightstatus-widget">Flight Status</button>
      </div>
      <div role="toolbar" class="header-menus">
        <button>Travel Info</button>
        <button>SkyMiles</button>
        <button>Need Help?</button>
      </div>
      <div class="header-help">
        <a class="button" href="https://delta.com/us/en/need-help/overview">Need Help?</a>
      </div>
    </div>
    <div class="header-tools">
      <a data-role="signup" class="button primary" href="#">Sign Up</a>
      <a data-role="login" class="button cta" href="#">Log In</a>
      <button data-role="notification"><span class="icon icon-bell"/></button>
      <button data-role="search"><span class="icon icon-search"/></button>
    </div>
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

  async #decorateTabs() {
    const tabs = this.shadowRoot.querySelector('.header-tabs');
    tabs.role = 'tablist';
    tabs.querySelectorAll('button').forEach((tab) => {
      tab.role = 'tab';
      tab.setAttribute('aria-selected', 'false');
      tab.tabindex = '-1';
      tab.addEventListener('click', (ev) => {
        const id = ev.currentTarget.getAttribute('aria-controls');
        const el = this.shadowRoot.getElementById(id);
        const selected = ev.currentTarget.getAttribute('aria-selected') === 'true';
        el.setAttribute('aria-hidden', selected);
      });
    });
  }

  async #decorateWidgets() {
    const widgets = this.shadowRoot.querySelectorAll('.header-widget');
    widgets.forEach((widget) => {
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
    });
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
    await this.#decorateTabs();
    await this.#decorateWidgets();
    await this.lib.decorateIcons(this.shadowRoot);
  }

  async loadLazy() {
    this.shadowRoot.querySelector('.header-toggle').addEventListener('click', (ev) => {
      const button = ev.target.closest('button');
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !expanded);
      button.getAttribute('aria-controls').split(' ').forEach((id) => {
        const target = this.shadowRoot.getElementById(id);
        target.setAttribute('aria-hidden', expanded);
      });
    });
  }

  async loadDelayed() {}
}

customElements.define('header-app', HeaderComponent);
