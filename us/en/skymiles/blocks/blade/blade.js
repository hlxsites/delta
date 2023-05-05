export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture,.button')
        || (div.querySelector('strong') && div.querySelector('strong').textContent === div.textContent))) {
        div.className = 'blade-image';
        if (div.querySelector('strong')) {
          div.classList.add('blade-label');
        }
      } else {
        div.className = 'blade-body';
        const a = div.lastElementChild.querySelector('a:only-child:last-child');
        try {
          if (a && new URL(a.href).pathname === new URL(a.textContent).pathname) {
            div.parentElement.classList.add('is-link');
            a.innerHTML = row.innerHTML;
            a.querySelector('a').remove();
            row.innerHTML = '';
            row.append(a);
            row.querySelector('strong').remove();
          }
        } catch (err) {
          // ignore, we just have an invalid link
        }
      }
    });
  });
}
