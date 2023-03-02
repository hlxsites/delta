export default async function decorate(block) {
  console.log(block.innerHTML);
  const pictures = [...block.querySelectorAll('picture')];
  pictures.forEach((p) => console.log(p.innerHTML));
  pictures.sort((p1, p2) => {
    const img1 = p1.querySelector('img');
    const img2 = p2.querySelector('img');
    return img1.width < img2.width;
  });

  pictures.forEach((p) => console.log(p.innerHTML));

  const responsivePicture = document.createElement('picture');

  responsivePicture.append(pictures[0].querySelector('source:not([media])'));
  responsivePicture.append(pictures[0].querySelector('img'));

  pictures[1].querySelectorAll('source[media]').forEach((e) => {
    e.setAttribute('media', '(min-width: 768px)');
    responsivePicture.prepend(e);
  });

  pictures.forEach((p) => p.remove());

  block.firstElementChild.firstElementChild.append(responsivePicture);
}
