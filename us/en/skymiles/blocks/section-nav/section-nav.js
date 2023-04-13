import { constants } from './aria-menu.js';

let lastScrollPosition;
export default async function decorate(block) {
  block.innerHTML = '';

  const response = await fetch('/us/en/skymiles/sectionav.plain.html');
  if (!response.ok) {
    return;
  }
  const html = await response.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  container.innerHTML = container.firstElementChild.innerHTML;

  const element = document.createElement(constants.tagName);
  element.innerHTML = container.innerHTML;
  element.setAttribute('aria-label', 'Site Section Navigation');
  element.querySelectorAll('ul').forEach((menu) => { menu.style.maxHeight = 0; });
  element.onToggle = (submenu, expanded) => {
    if (expanded && submenu === element.querySelector('.section-nav-menu')) {
      lastScrollPosition = window.scrollY;
    }
    if (!expanded) {
      submenu.style.maxHeight = 0;
      return new Promise((resolve) => {
        element.addEventListener('transitionend', resolve, { once: true });
      });
    }
    if (submenu.classList.contains('section-nav-menu')) {
      submenu.style.maxHeight = `${window.innerHeight - 146}px`;
      return Promise.resolve();
    }
    if (window.innerWidth < 768) {
      submenu.style.maxHeight = '100vh';
    } else {
      submenu.style.maxHeight = `${submenu.childElementCount * submenu.firstElementChild.getBoundingClientRect().height}px`;
    }
    return Promise.resolve();
  };
  block.append(element);
  element.firstElementChild.classList.add('section-nav-toggle');
  element.firstElementChild.nextElementSibling.classList.add('section-nav-menu');

  const currentLink = element.querySelector(`a[href$="${window.location.pathname}"]`)
    || element.querySelector('a');
  if (!currentLink) {
    return;
  }

  const current = document.createElement('div');
  current.classList.add('section-nav-current');
  current.textContent = currentLink.textContent;

  block.append(current);
}

window.addEventListener('scroll', () => {
  const menu = document.querySelector('.section-nav [role="menu"][aria-hidden="false"]');
  if (!menu) {
    return;
  }
  if (Math.abs(lastScrollPosition - window.scrollY) > 50) {
    menu.closest('hlx-aria-menu').closeAll();
  }
}, { passive: true });
