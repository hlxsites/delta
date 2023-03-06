export default async function decorate(block) {
  const accordions = [...block.children];
  accordions.forEach((accordion) => {
    accordion.classList.add('accordion-section');
  });

  const parents = block.querySelectorAll('.accordion-section');
  parents.forEach((({ children }) => {
    children[0].classList.add('header');
    children[0].setAttribute('aria-expanded', 'false');
    children[1].classList.add('text');
  }));

  const expand = document.querySelector('.accordion-container .default-content-wrapper h4');
  expand.classList.add('bold');
  const collapse = document.querySelector('.accordion-container .default-content-wrapper h5');
  const wrappers = block.querySelectorAll('.accordion-section');

  // expand all accordions
  expand.addEventListener('click', () => {
    expand.classList.remove('bold');
    collapse.classList.add('bold');
    const wrapper = expand.parentElement.nextElementSibling;
    const headers = wrapper.querySelectorAll('.header');
    const texts = wrapper.querySelectorAll('.text');
    texts.forEach((text) => {
      text.classList.add('visible');
    });
    headers.forEach((header) => {
      header.setAttribute('aria-expanded', 'false');
    });
  });

  // collapse all accordions
  collapse.addEventListener('click', () => {
    collapse.classList.remove('bold');
    expand.classList.add('bold');
    const wrapper = collapse.parentElement.nextElementSibling;
    const texts = wrapper.querySelectorAll('.text');
    texts.forEach((text) => {
      text.classList.remove('visible');
    });
  });

  // make content for accordion visible on header click
  wrappers.forEach((wrapper) => {
    const headers = wrapper.querySelectorAll('.header');
    headers.forEach((header) => {
      header.addEventListener('click', () => {
        const text = header.nextElementSibling;
        text.classList.toggle('visible');
        const expanded = text.classList.contains('visible');
        header.setAttribute('aria-expanded', expanded);
        headers.forEach((otherDiv) => {
          if (otherDiv !== header) {
            otherDiv.classList.remove('clicked');
          }
        });
        header.classList.toggle('clicked');
      });
    });
  });
}
