export default async function decorate(block) {
  const response = await fetch('/us/en/skymiles/sectionav.plain.html');
  if (!response.ok) {
    return;
  }
  const html = await response.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  container.innerHTML = container.firstElementChild.innerHTML;

  const button = document.createElement('button');
  button.classList.add('section-nav-toggle');
  button.setAttribute('aria-expanded', false);
  button.innerHTML = container.querySelector('h1,h2,h3').innerHTML;
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    document.querySelector('.section-nav-menu').setAttribute('aria-expanded', !expanded);
  });

  const menu = document.createElement('div');
  menu.classList.add('section-nav-menu');
  menu.setAttribute('aria-expanded', false);
  menu.innerHTML = container.querySelector('ul,ol').outerHTML;
  menu.querySelectorAll('li').forEach((li) => {
    if (!li.querySelector('ul')) {
      return;
    }
    const toggle = document.createElement('button');
    toggle.setAttribute('aria-expanded', false);
    li.querySelector('ul').setAttribute('aria-expanded', false);
    toggle.textContent = li.childNodes[0].textContent;
    li.childNodes[0].replaceWith(toggle);
  });
  menu.addEventListener('click', (ev) => {
    const expanded = ev.target.getAttribute('aria-expanded') === 'true';
    ev.target.setAttribute('aria-expanded', !expanded);
    ev.target.parentElement.querySelector('ul').setAttribute('aria-expanded', !expanded);
  });

  const currentLink = menu.querySelector(`a[href="${window.location.pathname}"]`)
    || menu.querySelector('a');
  if (!currentLink) {
    return;
  }

  const current = document.createElement('div');
  current.classList.add('section-nav-current');
  current.textContent = currentLink.textContent;

  block.append(button);
  block.append(menu);
  block.append(current);

  window.addEventListener('scroll', () => {
    const isSticky = block.classList.contains('is-sticky');
    const shouldSticky = window.scrollY > 64;
    if (isSticky !== shouldSticky) {
      block.classList.toggle('is-sticky', shouldSticky);
    }
  }, { passive: true });
}
