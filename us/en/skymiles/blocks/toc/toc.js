export default function decorate(block) {
  const currentToc = block.querySelector('ul');

  if (!!currentToc) {
    return;
  }

  const tocWrapper = document.querySelector('.toc-wrapper');
  const toc = document.createElement('ul');

  let nextSiblingDiv = tocWrapper.nextElementSibling;

  while (nextSiblingDiv) {
    const h2Tags = nextSiblingDiv.querySelectorAll('h2');

    h2Tags.forEach((heading) => {
      const item = document.createElement('li');
      const link = document.createElement('a');

      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      item.appendChild(link);
      toc.appendChild(item);
    });

    nextSiblingDiv = nextSiblingDiv.nextElementSibling;
  }
  block.innerHTML = toc.outerHTML;
}
