export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture,.button')) {
        div.className = 'blade-image';
      } else {
        div.className = 'blade-body';
        const a = div.lastElementChild.querySelector('a:only-child:last-child');
        a.classList.add('wrap');
        try {
          if (a && new URL(a.href).pathname === new URL(a.textContent).pathname) {
            div.parentElement.classList.add('is-link');
            div.addEventListener('click', () => {
              window.location.href = div.querySelector('a').href;
            });
            a.parentElement.style.display = 'none';
          }
        } catch (err) {
          // ignore, we just have an invalid link
        }
      }
    });
    const body = row.querySelector('.blade-body');
    const image = row.querySelector('.blade-image');
    const link = body.querySelector('.wrap');
    const href = link.getAttribute('href');
    link.remove();
    const p = body.querySelector('p > strong');
    if (p) {
      p.remove(); // Remove the p tag which originally contained the anchor tag
    }
    const newLink = document.createElement('a');
    newLink.classList.add('link');
    newLink.setAttribute('href', href);
    row.insertBefore(newLink, image);
    newLink.appendChild(image);
    newLink.appendChild(body);
  });
}
