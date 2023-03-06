export default function decorate(block) {
  const currentToc = block.querySelector('ul');
  const newToc = document.createElement('ul');

  [...currentToc.children].forEach((title) => {
    const textTags = document.querySelectorAll('h1, h2, h3, h4, h5, h6', 'p');
    let matchedTitle = null;

    for (let i = 0; i < textTags.length; i += 1) {
      if (textTags[i].textContent.includes(title.textContent)) {
        matchedTitle = textTags[i];
        break;
      }
    }

    /* Create a new ToC title with link */
    if (matchedTitle) {
      const item = document.createElement('li');
      const link = document.createElement('a');

      link.href = `#${matchedTitle.id}`;
      link.textContent = title.textContent;
      item.appendChild(link);
      newToc.appendChild(item);
    }
  });

  block.innerHTML = newToc.outerHTML;
}
