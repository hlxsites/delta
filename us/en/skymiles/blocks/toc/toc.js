export default function decorate(block) {
  const currentToc = block.querySelector('ul');

  if (currentToc) {
    return;
  }
  const toc = document.createElement('ul');
  const h2Tags = [...document.querySelectorAll('h2')].filter((h2) => block.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING);

  h2Tags.forEach((heading) => {
    const item = document.createElement('li');
    const link = document.createElement('a');

    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    item.appendChild(link);
    toc.appendChild(item);
  });

  block.innerHTML = toc.outerHTML;
}
