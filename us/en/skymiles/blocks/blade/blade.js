export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'blade-image';
      } else {
        div.className = 'blade-body';
        const a = div.querySelector('a');
        if (a) {
          block.classList.add('is-link');
          div.addEventListener('click', () => {
            window.location.href = div.querySelector('a').href;
          });
        }
      }
    });
  });
}
