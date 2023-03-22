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

  // Find the next title and link
  const currentLiElement = sectionNavDiv.querySelector(`li > a[href$="${window.location.pathname}"]`);
  let parentLiElement = currentLiElement.parentElement;
  let nextLiElement = parentLiElement.nextElementSibling;

  // Switch section nav for the last page of the section
  if (!nextLiElement) {
    parentLiElement = parentLiElement.parentElement.parentElement;
    nextLiElement = parentLiElement.nextElementSibling.querySelector('li');
  
    // Switch section nav for the overview page
  } else if (nextLiElement.querySelector('li')) {
    nextLiElement = nextLiElement.querySelector('li');
  }

  const container = document.createElement('div');

  // Link to next page
  const link = document.createElement('a');
  link.href = nextLiElement.querySelector('a').href;

  // Next
  const nextDiv = document.createElement('div');
  nextDiv.classList.add('next');
  nextDiv.innerText = 'Next';

  // Next page name
  const nextPageNameDiv = document.createElement('div');
  nextPageNameDiv.classList.add('next-page-name');
  nextPageNameDiv.innerText = nextLiElement.textContent;

  // Next arrow
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
  block.innerHTML = container.innerHTML;

  decorateIcons(block);
}
