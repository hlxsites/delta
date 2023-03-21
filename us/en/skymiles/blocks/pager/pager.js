import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  block.innerHTML = '';

  const response = await fetch('/us/en/skymiles/sectionav.plain.html');
  if (!response.ok) {
    return;
  }
  const html = await response.text();

  const sectionNavDiv = document.createElement('div');
  sectionNavDiv.innerHTML = html;

  const currentLink = sectionNavDiv.querySelector(`a[href$="${window.location.pathname}"]`) || sectionNavDiv.querySelector('a');
  if (!currentLink) {
    return;
  }

  // Find the next title and link
  const currentLiElement = sectionNavDiv.querySelector(`li > a[href="${currentLink.href}"]`);
  let parentLiElement = currentLiElement.parentElement;
  let nextLiElement = parentLiElement.nextElementSibling;

  // Switch section nav
  while (!nextLiElement) {
    parentLiElement = parentLiElement.parentElement.parentElement;
    nextLiElement = parentLiElement.nextElementSibling;
    nextLiElement = nextLiElement.querySelector('li');
  }

  const container = document.createElement('div');
  container.classList.add('pager-container');

  const link = document.createElement('a');
  link.href = nextLiElement.querySelector('a').href;

  const nextDiv = document.createElement('div');
  nextDiv.classList.add('next');
  nextDiv.innerText = 'Next';

  const nextPageNameDiv = document.createElement('div');
  nextPageNameDiv.classList.add('next-page-name');
  nextPageNameDiv.innerText = nextLiElement.textContent;

  const ICON = '<span class="icon icon-right-arrow"></span>';
  const nextArrowDiv = document.createElement('div');
  nextArrowDiv.classList.add('next-arrow');
  nextArrowDiv.innerHTML = ICON;

  // Append child div elements to anchor tag
  link.appendChild(nextDiv);
  link.appendChild(nextPageNameDiv);
  link.appendChild(nextArrowDiv);

  // Append anchor tag to container div
  container.appendChild(link);

  // Append container div to block body
  block.innerHTML = container.outerHTML;

  decorateIcons(block);
}
