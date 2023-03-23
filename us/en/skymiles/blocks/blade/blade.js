export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture,.button')) {
        div.className = 'blade-image';
      } else {
        div.className = 'blade-body';
        const a = div.lastElementChild.querySelector('a:only-child:last-child');
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
  });
}
