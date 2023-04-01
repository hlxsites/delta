import { toClassName } from '../../scripts/lib-franklin.js';

export const constants = {
  tagName: 'hlx-aria-menu',
  withControls: 'with-controls',
};

export class AriaMenu extends HTMLElement {
  static getId() {
    return Math.random().toString(32).substring(2);
  }

  connectedCallback() {
    this.decorate();
    this.attachListeners();
  }

  attachListeners() {
    this.firstElementChild.addEventListener('click', (ev) => {
      this.toggleMenu(ev.currentTarget);
    });
    this.firstElementChild.addEventListener('keydown', (ev) => {
      const menu = ev.target.nextElementSibling;
      const items = [...menu.querySelectorAll(':scope > [role="none"] > [role="menuitem"]')];
      switch (ev.key) {
        case 'ArrowUp':
          ev.preventDefault();
          this.toggleMenu(ev.currentTarget);
          this.focusItem(menu, items.length - 1);
          break;
        case 'ArrowDown':
          ev.preventDefault();
          this.toggleMenu(ev.currentTarget);
          break;
        default:
          break;
      }
    });
    this.querySelectorAll('[role="menuitem"]').forEach((item) => {
      item.addEventListener('click', (ev) => {
        this.toggleMenu(ev.currentTarget);
      });
      item.addEventListener('keydown', (ev) => {
        const menu = ev.currentTarget.closest('[role="menu"]');
        if (!menu) {
          return;
        }
        const items = [...menu.querySelectorAll(':scope > [role="none"] > [role="menuitem"]')];
        const currentIndex = items.indexOf(ev.currentTarget);
        switch (ev.key) {
          case 'Escape':
            this.closeAll();
            break;
          case 'Home':
            ev.preventDefault();
            this.focusItem(menu, 0);
            break;
          case 'ArrowUp':
            ev.preventDefault();
            this.focusItem(menu, currentIndex - 1);
            break;
          case 'ArrowDown':
            ev.preventDefault();
            this.focusItem(menu, currentIndex + 1);
            break;
          case 'ArrowLeft': {
            ev.preventDefault();
            const parentMenu = ev.currentTarget.closest('[role="menu"]');
            if (!parentMenu) {
              return;
            }
            const parentItem = this.querySelector(`[aria-controls="${parentMenu.id}"]`);
            this.toggleMenu(parentItem);
            break;
          }
          case 'ArrowRight':
            ev.preventDefault();
            this.toggleMenu(ev.currentTarget);
            break;
          case 'End':
            ev.preventDefault();
            this.focusItem(menu, items.length - 1);
            break;
          default:
            break;
        }
      });
    });
  }

  async decorate() {
    const button = document.createElement('button');
    button.innerHTML = this.firstElementChild.outerHTML;
    button.setAttribute('aria-expanded', false);
    button.setAttribute('aria-haspopup', true);
    this.firstElementChild.replaceWith(button);
    button.nextElementSibling.setAttribute('aria-label', 'Section navigation');
    this.querySelectorAll('li').forEach((item) => {
      item.role = 'none';
      item.childNodes.forEach((child, i) => {
        if (child.nodeType === Node.TEXT_NODE && i === 0) {
          const toggle = document.createElement('button');
          toggle.role = 'menuitem';
          toggle.tabIndex = -1;
          toggle.textContent = child.nodeValue;
          child.replaceWith(toggle);
        } else if (child.nodeType === Node.TEXT_NODE && !child.nodeValue.trim()) {
          child.remove();
        } else if (child.nodeName === 'A') {
          child.role = 'menuitem';
          child.tabIndex = -1;
        } else if ((child.nodeName === 'UL' || child.nodeName === 'OL')) {
          child.previousSibling.setAttribute('aria-expanded', false);
          child.previousSibling.setAttribute('aria-haspopup', true);
        }
      });
    });
    this.querySelectorAll('ul,ol').forEach((list) => {
      const id = AriaMenu.getId();
      list.id = id;
      list.role = 'menu';
      list.setAttribute('aria-hidden', true);
      list.previousElementSibling.setAttribute('aria-controls', id);
    });
    this.querySelector('[role="menuitem"]').tabIndex = 0;
  }

  closeAll() {
    this.querySelectorAll('[role="menuitem"][aria-expanded="true"]').forEach((item) => {
      item.setAttribute('aria-expanded', false);
      item.tabIndex = -1;
    });
    this.querySelectorAll('[role="menu"][aria-hidden="false"]').forEach((item) => {
      item.setAttribute('aria-hidden', true);
    });
    this.firstElementChild.setAttribute('aria-expanded', false);
    this.firstElementChild.focus();
  }

  focusItem(menu, index) {
    const items = [...menu.querySelectorAll(':scope > [role="none"] > [role="menuitem"]')];
    let i = index;
    if (i < 0) {
      i = items.length - 1;
    } else if (i > items.length - 1) {
      i = 0;
    }
    const current = items.find((item) => item.tabIndex === 0);
    if (current) {
      current.tabIndex = -1;
    }
    items[i].tabIndex = 0;
    items[i].focus();
  }

  toggleMenu(item) {
    const expanded = item.getAttribute('arie-expanded') === 'true';
    const menu = document.getElementById(item.getAttribute('aria-controls'));
    if (!menu) {
      return;
    }
    item.setAttribute('arie-expanded', !expanded);
    menu.setAttribute('aria-hidden', expanded);
    if (expanded) {
      item.tabIndex = 0;
      item.focus();
    } else {
      if (item !== this.firstElementChild) {
        item.tabIndex = -1;
      }
      this.focusItem(menu, 0);
    }
  }
}

customElements.define(constants.tagName, AriaMenu);
