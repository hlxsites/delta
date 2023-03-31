import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.childElementCount === 0) div.remove();
      else if (div.childElementCount === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else {
        div.className = 'cards-card-body';
        const p = div.querySelector('p:last-child');
        const a = div.querySelector('p:last-child > a:only-child');
        if (p && a && p.textContent === a.textContent) {
          li.classList.add('is-link');
          try {
            if (a.href === a.textContent
              || new URL(a.href).pathname === new URL(a.textContent).pathname) {
              a.parentElement.style.display = 'none';
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            // if we don't have valid URLs, just ignore it
          }
          div.addEventListener('click', () => {
            window.location.href = div.querySelector('a').href;
          });
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
