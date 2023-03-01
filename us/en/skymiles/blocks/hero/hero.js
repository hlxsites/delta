export default async function decorate(block) {
  const pictureElement = document.createElement('picture');
  const picture = document.querySelectorAll('picture');

  picture[1].querySelectorAll('source[media]').forEach((e) => {
    e.setAttribute('media', '(min-width: 768px)');
    pictureElement.append(e);
  });

  pictureElement.append(picture[0].querySelector('source:not([media])'));
  pictureElement.append(picture[0].querySelector('img'));

  picture[0].remove();
  picture[1].remove();

  block.firstElementChild.firstElementChild.append(pictureElement);
}
