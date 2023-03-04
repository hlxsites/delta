export default function decorate(block) {
  const headings = document.querySelectorAll("h3");
  const toc = document.createElement("ul");

  headings.forEach((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    item.appendChild(link);
    toc.appendChild(item);
  });

  block.innerHTML = toc.outerHTML;
}