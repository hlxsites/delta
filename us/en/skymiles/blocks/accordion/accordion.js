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

  // creating buttons in text divs
  const textDiv = block.querySelectorAll('.text');
  textDiv.forEach((text) => {
    const textButton = text.querySelectorAll('p > small > strong');
    textButton.forEach((tb) => {
      const button = document.createElement('button');
      button.textContent = tb.textContent;
      const p = tb.closest('p');
      p.parentNode.insertBefore(button, p);
      p.parentNode.removeChild(p);
    });
  });

  const parentWrapper = document.querySelectorAll('.accordion-wrapper');
  parentWrapper.forEach((wrapper) => {
    if (!wrapper.querySelector('.toolbar')) {
      // Create the toolbar div
      const toolbar = document.createElement('div');
      toolbar.classList.add('toolbar');

      // Create the Expand All button
      const expandButton = document.createElement('button');
      expandButton.classList.add('tertiary');
      expandButton.classList.add('expand');
      expandButton.textContent = 'Expand All';
      toolbar.appendChild(expandButton);

      // Create the Collapse All button
      const collapseButton = document.createElement('button');
      collapseButton.classList.add('tertiary');
      collapseButton.classList.add('collapse');
      collapseButton.textContent = 'Collapse All';
      toolbar.appendChild(collapseButton);

      wrapper.insertBefore(toolbar, wrapper.querySelector('.accordion.block'));
      const headers = wrapper.querySelectorAll('.header');

      // add click events to expand and collapse buttons
      expandButton.addEventListener('click', () => {
        expandButton.classList.toggle('light');
        collapseButton.classList.toggle('highlight');
        expandButton.classList.remove('highlight');
        collapseButton.classList.remove('light');
        const texts = wrapper.querySelectorAll('.text');
        for (let j = 0; j < texts.length; j += 1) {
          const text = texts[j];
          text.setAttribute('aria-expanded', 'true');
        }
        headers.forEach((header) => {
          header.setAttribute('aria-expanded', 'true');
        });
      });

      collapseButton.addEventListener('click', () => {
        expandButton.classList.remove('light');
        collapseButton.classList.remove('highlight');
        expandButton.classList.toggle('highlight');
        collapseButton.classList.toggle('light');
        const texts = wrapper.querySelectorAll('.text');
        for (let j = 0; j < texts.length; j += 1) {
          const text = texts[j];
          text.setAttribute('aria-expanded', 'false');
        }
        headers.forEach((header) => {
          header.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });

  // make content for accordion visible on header click
  const wrappers = block.querySelectorAll('.accordion-section');
  wrappers.forEach((wrapper) => {
    const headers = wrapper.querySelectorAll('.header');
    headers.forEach((header) => {
      header.setAttribute('role', 'button');
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
