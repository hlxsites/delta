export default async function decorate(block) {
  const slides = [...block.children];
  slides.forEach((slide) => {
    slide.classList.add('banner-slide');
  });
  const parents = document.querySelectorAll('.banner-slide');
  parents.forEach((({ children }) => {
    children[0].classList.add('banner-image');
    children[0].querySelector('img').loading = 'eager';
    children[1].classList.add('banner-text');
  }));

  const randomIndex = Math.floor(Math.random() * parents.length);
  for (let i = 0; i < parents.length; i += 1) {
    if (i === randomIndex) {
      parents[i].classList.add('show');
    } else {
      parents[i].classList.add('hide');
    }
  }
}
