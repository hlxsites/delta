export default async function decorate(block) {
  const pStrong = block.querySelector('p strong');
  const section = block.parentElement.parentElement.nextElementSibling;
  const defaultContent = section.querySelector('div:first-child');
  const pElement = document.createElement('p');
  const strongElement = document.createElement('strong');
  strongElement.textContent = pStrong.textContent;
  pElement.appendChild(strongElement);
  defaultContent.insertBefore(pElement, defaultContent.firstChild);

  const pParentElement = pStrong.parentElement;
  if (pParentElement && pParentElement.parentElement) {
    pParentElement.parentElement.removeChild(pParentElement);
  }
}
