import { toClassName } from '../../scripts/lib-franklin.js';

const HEADINGS_SELECTOR = 'h1,h2,h3,h4,h5,h6';

export const constants = {
  tagName: 'hlx-aria-tabs',
};

export class AriaTabs extends HTMLElement {
  static getId() {
    return Math.random().toString(32).substring(2);
  }

  connectedCallback() {
    this.selectedIndex = 0;
    this.itemsCount = this.children.length;
    this.decorate();
    this.attachListeners();
  }

  attachListeners() {
    this.querySelectorAll('[role="tab"]').forEach((tab) => {
      tab.addEventListener('click', (ev) => {
        this.selectItem(ev.currentTarget);
      });
      tab.addEventListener('keydown', (ev) => {
        switch (ev.key) {
          case 'Home':
            ev.preventDefault();
            this.focusItem(0);
            break;
          case 'ArrowLeft':
            ev.preventDefault();
            this.focusItem(this.selectedIndex - 1);
            break;
          case 'ArrowRight':
            ev.preventDefault();
            this.focusItem(this.selectedIndex + 1);
            break;
          case 'End':
            ev.preventDefault();
            this.focusItem(this.itemsCount - 1);
            break;
          default:
            break;
        }
      });
    });
  }

  async decorate() {
    const tablist = document.createElement('div');
    tablist.role = 'tablist';
    tablist.setAttribute('aria-orientation', 'horizontal');
    [...this.children].forEach((el, i) => {
      const id1 = AriaTabs.getId();
      const id2 = AriaTabs.getId();
      const button = document.createElement('button');
      button.id = id1;
      button.role = 'tab';
      button.setAttribute('tabindex', i === this.selectedIndex ? 0 : -1);
      button.setAttribute('aria-selected', i === this.selectedIndex);
      button.setAttribute('aria-controls', id2);
      button.append(el.firstElementChild);
      tablist.append(button);

      const panel = el;
      panel.id = id2;
      panel.role = 'tabpanel';
      panel.setAttribute('aria-labelledby', id1);
      panel.setAttribute('aria-hidden', i !== this.selectedIndex);
    });
    this.prepend(tablist);
  }

  focusItem(index) {
    let rotationIndex = index;
    if (index < 0) {
      rotationIndex = this.itemsCount - 1;
    } else if (index > this.itemsCount - 1) {
      rotationIndex = 0;
    }
    const buttons = this.querySelectorAll('[role="tab"]');
    buttons[this.selectedIndex].setAttribute('tabindex', -1);
    this.selectedIndex = rotationIndex;
    buttons[this.selectedIndex].setAttribute('tabindex', 0);
    buttons[this.selectedIndex].focus();
  }

  selectItem(button) {
    this.querySelector('[role="tab"][aria-selected="true"]').setAttribute('aria-selected', false);
    this.querySelector('[role="tabpanel"][aria-hidden="false"]').setAttribute('aria-hidden', true);
    button.setAttribute('aria-selected', true);
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    panel.setAttribute('aria-hidden', false);
  }
}

customElements.define(constants.tagName, AriaTabs);
