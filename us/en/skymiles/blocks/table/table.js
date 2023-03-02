import { decorateButtons, decorateIcons } from '../../scripts/lib-franklin.js';

function toggleVisibleColumns(block, indexes) {
  const width = 100 / indexes.length;
  block.querySelectorAll('table tr > *').forEach((cell) => {
    const index = Array.prototype.indexOf.call(cell.parentNode.children, cell);
    cell.style.display = indexes.includes(index) ? 'table-cell' : 'none';
    cell.style.width = `${width}%`;
  });
}

function navClickHandler(ev) {
  ev.preventDefault();
  const block = ev.target.closest('.block');
  const table = block.querySelector('table');
  const colCount = table.querySelector('thead > tr').children.length;
  let visibleIndex = table.visibleColIndex;
  if (ev.currentTarget.dataset.role === 'prev') {
    visibleIndex = Math.max(visibleIndex - 1, 1);
  } else if (ev.currentTarget.dataset.role === 'next') {
    visibleIndex = Math.min(visibleIndex + 1, colCount - 1);
  } else {
    return;
  }

  block.querySelector('button[data-role="prev"]').disabled = visibleIndex === 1;
  block.querySelector('button[data-role="next"]').disabled = visibleIndex === colCount - 1;
  toggleVisibleColumns(block, [0, visibleIndex]);
  table.visibleColIndex = visibleIndex;
}

export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  table.append(thead);

  const tbody = document.createElement('tbody');
  table.append(tbody);

  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((c, j) => {
      const cell = document.createElement(i > 0 && j > 0 ? 'td' : 'th');
      cell.innerHTML = `<p>${c.innerHTML}</p>`;
      tr.append(cell);
    });
    (i > 0 ? tbody : thead).append(tr);
  });
  block.innerHTML = table.outerHTML;

  if (window.innerWidth < 992 && block.classList.contains('list')) {
    const columnsCount = block.firstElementChild.children.length;
    const div = document.createElement('div');
    for (let i = 1; i < columnsCount; i += 1) {
      const dl = document.createElement('dl');
      [...block.children].forEach((c) => {
        const dt = document.createElement('dt');
        dt.innerHTML = c.children[0].innerHTML;
        dl.append(dt);
        const dd = document.createElement('dd');
        dd.innerHTML = c.children[i].innerHTML;
        dl.append(dd);
      });
      div.append(dl);
    }
    block.innerHTML = div.outerHTML;
  } else if (window.innerWidth < 992) {
    const DEFAULT_VISIBLE_COL_INDEX = 1;
    const ICON = '<span class="icon icon-down-chevron"></span>';
    block.querySelector('table').visibleColIndex = DEFAULT_VISIBLE_COL_INDEX;
    const nextButton = document.createElement('button');
    nextButton.dataset.role = 'next';
    nextButton.innerHTML = ICON;
    nextButton.addEventListener('click', navClickHandler);
    block.prepend(nextButton);

    const prevButton = document.createElement('button');
    prevButton.dataset.role = 'prev';
    prevButton.disabled = true;
    prevButton.innerHTML = ICON;
    prevButton.addEventListener('click', navClickHandler);
    block.prepend(prevButton);
    toggleVisibleColumns(block, [0, DEFAULT_VISIBLE_COL_INDEX]);
  }

  decorateIcons(block);
  decorateButtons(block);
}

window.addEventListener('scroll', () => {
  if (window.innerWidth >= 992) {
    return;
  }
  document.querySelectorAll('.table').forEach((block) => {
    const rect = block.getBoundingClientRect();
    const shouldStickyNav = rect.top < 100 && rect.height + rect.y > 100;
    const isAlreadyStickyNav = block.classList.contains('is-sticky-nav');
    if (isAlreadyStickyNav === shouldStickyNav) {
      return;
    }
    block.classList.toggle('is-sticky-nav', shouldStickyNav);
    block.querySelector('button[data-role="next"]').style.right = shouldStickyNav
      ? `${(window.innerWidth - rect.width) / 2}px`
      : '';
  });
}, { passive: true });
