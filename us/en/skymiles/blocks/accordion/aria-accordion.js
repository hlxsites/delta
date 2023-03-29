export const TAG = 'hlx-aria-accordion';

export const constants = {
  tagName: 'hlx-aria-accordion',
  codeBasePath: 'base-path',
  withControls: 'with-controls',
};

export class AriaAccordion extends HTMLElement {
  constructor() {
    super();
    this.options = {
      codeBasePath: this.getAttribute('base-path'),
      itemsCount: this.children.length,
      selectedIndex: 0,
      withControls: this.getAttribute('with-controls'),
    };
  }

  async connectedCallback() {
    this.decorate();
    this.attachListeners();
  }

  attachListeners() {
    const items = this.querySelectorAll('button[aria-expanded]');
    items.forEach((item) => {
      item.addEventListener('click', (ev) => {
        this.toggleItem(ev.currentTarget);
      });
      item.addEventListener('keydown', (ev) => {
        switch (ev.key) {
          case 'ArrowUp':
            ev.preventDefault();
            this.focusItem(this.options.selectedIndex - 1);
            break;
          case 'ArrowDown':
            ev.preventDefault();
            this.focusItem(this.options.selectedIndex + 1);
            break;
          default:
            break;
        }
      });
    });
    if (this.options.withControls) {
      const [expand, collapse] = [...this.querySelectorAll('[role="group"] button')];
      expand.addEventListener('click', () => this.toggleAll(true));
      collapse.addEventListener('click', () => this.toggleAll(false));
    }
  }

  async decorate() {
    let idBtn;
    let idPnl;
    [...this.children].forEach((el, i) => {
      idBtn = Math.random().toString(32).substring(2);
      idPnl = Math.random().toString(32).substring(2);

      const button = document.createElement('button');
      button.id = idBtn;
      button.setAttribute('aria-expanded', false);
      button.setAttribute('aria-controls', idPnl);
      button.setAttribute('tabindex', i === this.options.selectedIndex ? 0 : -1);
      button.innerHTML = el.firstElementChild.outerHTML;
      el.firstElementChild.replaceWith(button);

      const panel = document.createElement('div');
      panel.id = idPnl;
      panel.role = 'region';
      panel.setAttribute('aria-hidden', true);
      panel.setAttribute('aria-labelledby', idBtn);
      panel.innerHTML = el.firstElementChild.nextElementSibling.outerHTML;
      el.firstElementChild.nextElementSibling.replaceWith(panel);
    });
    if (this.options.withControls) {
      const ids = [...this.querySelectorAll('[role="region"]')].map((el) => el.id).join(' ');
      const div = document.createElement('div');
      div.role = 'group';
      const expand = document.createElement('button');
      expand.setAttribute('aria-controls', ids);
      expand.textContent = 'Expand All';
      div.append(expand);
      const collapse = document.createElement('button');
      collapse.setAttribute('aria-controls', ids);
      collapse.textContent = 'Collapse All';
      collapse.disabled = true;
      div.append(collapse);
      this.prepend(div);
    }
  }

  toggleAll(visible) {
    this.querySelectorAll('button[aria-expanded]').forEach((btn) => {
      btn.setAttribute('aria-expanded', visible);
      btn.nextElementSibling.setAttribute('aria-hidden', !visible);
    });
    if (this.options.withControls) {
      const [expand, collapse] = [...this.querySelectorAll('[role="group"] button')];
      expand.disabled = visible;
      collapse.disabled = !visible;
    }
  }

  toggleItem(el) {
    const index = [...this.querySelectorAll('button[aria-expanded]')].indexOf(el);
    if (index !== this.options.selectedIndex) {
      this.focusItem(index);
    }
    const expanded = el.getAttribute('aria-expanded') === 'true';
    el.setAttribute('aria-expanded', !expanded);
    el.nextElementSibling.setAttribute('aria-hidden', expanded);
    if (this.options.withControls) {
      const [expand, collapse] = [...this.querySelectorAll('[role="group"] button')];
      expand.disabled = !this.querySelector('button[aria-expanded="false"]');
      collapse.disabled = !this.querySelector('button[aria-expanded="true"]');
    }
  }

  focusItem(index) {
    let rotationIndex = index;
    if (index < 0) {
      rotationIndex = this.options.itemsCount - 1;
    } else if (index > this.options.itemsCount - 1) {
      rotationIndex = 0;
    }
    const buttons = this.querySelectorAll('button[aria-expanded]');
    buttons[this.options.selectedIndex].setAttribute('tabindex', -1);
    this.options.selectedIndex = rotationIndex;
    buttons[this.options.selectedIndex].setAttribute('tabindex', 0);
    buttons[this.options.selectedIndex].focus();
    buttons[this.options.selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

customElements.define(TAG, AriaAccordion);
