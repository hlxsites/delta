export default async function decorate(block) {

  const allImg = document.querySelectorAll('img');
  const src1 = allImg[0].getAttribute('src');
  const src2 = allImg[1].getAttribute('src');
  console.log(allImg[0].width);
  console.log(allImg[1].width);


  // const picture = document.querySelector('picture');

  // const mediaQueryLarge = window.matchMedia('(min-width: 1200px)');
  // const mediaQueryMedium = window.matchMedia('(min-width: 768px)');
  // const mediaQuerySmall = window.matchMedia('(max-width: 767px)');

  // if (mediaQueryLarge.matches) {
  //   picture.querySelector('source').srcset = src1;
  // } else if (mediaQueryMedium.matches) {
  //   picture.querySelector('source').srcset = src1;
  // } else if (mediaQuerySmall.matches) {
  //   picture.querySelector('source').srcset = src2;
  // }

  const imageContainer = document.getElementsByClassName("hero");
  const pictureElement = document.createElement("picture");
  const sourceDesktop = document.createElement("source");
  const sourceMobile = document.createElement("source");
  const imgElement = document.createElement("img");

  // const img = document.querySelector('img');
  // const picture = document.createElement('picture');
  // const source = document.createElement('source');
  // source.setAttribute('srcset', img.getAttribute('src'));
  // picture.appendChild(source);
  // img.parentNode.insertBefore(picture, img);


  sourceDesktop.setAttribute("media", "(min-width: 400px)");
  sourceDesktop.setAttribute("srcset", src1);
  sourceDesktop.setAttribute("type", "image/webp");
  sourceDesktop.setAttribute("media", "(min-width: 400px)");
  sourceDesktop.setAttribute("srcset", src1);
  sourceDesktop.setAttribute("type", "image/webp");
  sourceDesktop.setAttribute("type", "image/png");
  sourceDesktop.setAttribute("srcset", src1);

  sourceMobile.setAttribute("media", "(max-width: 767px)");
  sourceMobile.setAttribute("srcset", src2);
  sourceMobile.setAttribute("srcset", src2);

  pictureElement.appendChild(sourceDesktop);
  pictureElement.appendChild(sourceMobile);
  pictureElement.appendChild(imgElement);

  if (allImg[0].width < allImg[1].width) {
    imgElement.setAttribute('width', '767');
    imgElement.setAttribute('height', '386');
    imgElement.setAttribute('src', src1);
  } else if (allImg[0].width > allImg[1].width) {
    imgElement.setAttribute("width", "1425");
    imgElement.setAttribute("height", "285");
    imgElement.setAttribute('src', src2);
  }

  // if (allImg[0].width > allImg[1].width) {
  //   imgElement.appendChild(src1)
  // } else if (allImg[1].width < allImg[0].width) {
  //   imgElement.appendChild(src2)
  // } else {
  //   return
  // }

  imageContainer[0].appendChild(pictureElement);
  allImg[0].parentElement.remove();
  allImg[1].parentElement.remove();

  block.firstElementChild.firstElementChild.append(pictureElement);
}

//
