export default async function decorate(block) {

  const imageContainer = document.getElementsByClassName("hero");
  // console.log(imageContainer);
  const pictureElement = document.createElement("picture");
  console.log(pictureElement);
  const sourceDesktop = document.createElement("source");
  const sourceMobile = document.createElement("source");
  const imgElement = document.createElement("img");
  console.log(imgElement);

  sourceDesktop.setAttribute("media", "(min-width: 768px)");
  sourceDesktop.setAttribute("srcset", "./media_18a11f58019b77d6ea1e1e9ee948a3fc1ff0329d5.jpeg?width=750&format=jpeg&optimize=medium");
  sourceDesktop.setAttribute("srcset", "./media_18a11f58019b77d6ea1e1e9ee948a3fc1ff0329d5.jpeg?width=750&format=webply&optimize=medium");

  sourceMobile.setAttribute("media", "(max-width: 767px)");
  sourceMobile.setAttribute("srcset", "./media_18250c97cda0268dbb157a394c1f2b16114c0309b.png?width=750&format=png&optimize=medium");
  sourceMobile.setAttribute("srcset", "./media_18a11f58019b77d6ea1e1e9ee948a3fc1ff0329d5.jpeg?width=750&format=webply&optimize=medium")

  pictureElement.appendChild(sourceDesktop);
  pictureElement.appendChild(sourceMobile);
  pictureElement.appendChild(imgElement);

  imageContainer[0].appendChild(pictureElement);
  // query first two images and delete them (queryselector)
  const allImg = document.querySelectorAll('img');
  allImg[0].parentElement.remove();
  console.log(allImg);

  // block.append(pictureElement);
  block.firstElementChild.firstElementChild.append(pictureElement);
}

