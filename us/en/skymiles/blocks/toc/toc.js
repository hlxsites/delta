export default function decorate(block) {
  const currentToc = block.querySelector('ul');

  if (currentToc) {
    block.querySelectorAll('a').forEach((a) => {
      try {
        const url = new URL(a.href);
        a.href = url.hash;
      } catch (err) {
        // Nothing to do, leave link in place
      }
    });
    return;
  }
  const toc = document.createElement('ul');
  const h2Tags = [...document.querySelectorAll('h2')]
    // eslint-disable-next-line no-bitwise
    .filter((h2) => block.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING);

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
