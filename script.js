'use strict';

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobileNav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileNav.hidden = !open;
});
for (const a of mobileNav.querySelectorAll('a')) a.addEventListener('click', closeMenu);

const filterButtons = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.product-card')];
for (const button of filterButtons) {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    for (const item of filterButtons) {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    }
    for (const card of cards) card.hidden = category !== 'all' && card.dataset.category !== category;
    const visible = cards.filter(card => !card.hidden).length;
    document.querySelector('#catalogNote').textContent = `Показано товаров: ${visible}. Цены учебные, наличие и стоимость нужно уточнять.`;
  });
}

const dialog = document.querySelector('#productDialog');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogDescription = document.querySelector('#dialogDescription');
const dialogPrice = document.querySelector('#dialogPrice');
for (const card of cards) {
  card.querySelector('.product-more').addEventListener('click', () => {
    dialogTitle.textContent = card.dataset.title;
    dialogDescription.textContent = card.dataset.description;
    dialogPrice.textContent = Number(card.dataset.price).toLocaleString('ru-RU') + ' сом';
    dialog.showModal();
  });
}
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.querySelector('#dialogContact').addEventListener('click', () => dialog.close());

const form = document.querySelector('#contactForm');
const result = document.querySelector('#formResult');
const error = document.querySelector('#formError');
const preview = document.querySelector('#formPreview');
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const contact = form.elements.contact.value.trim();
  if (name.length < 2 || contact.length < 5) {
    error.hidden = false;
    error.textContent = 'Укажите имя (от 2 символов) и способ связи (от 5 символов).';
    result.hidden = true;
    return;
  }
  error.hidden = true;
  const item = form.elements.item.value;
  const message = form.elements.message.value.trim();
  preview.textContent = `Здравствуйте! Меня зовут ${name}.\nИнтересует: ${item}.\nСвязь: ${contact}.${message ? '\nКомментарий: ' + message : ''}`;
  result.hidden = false;
  result.scrollIntoView({behavior: 'smooth', block: 'nearest'});
});
document.querySelector('#copyRequest').addEventListener('click', async event => {
  try {
    await navigator.clipboard.writeText(preview.textContent);
    event.currentTarget.textContent = 'Текст скопирован';
  } catch (e) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(preview);
    selection.removeAllRanges();
    selection.addRange(range);
    event.currentTarget.textContent = 'Текст выделен — нажмите Ctrl+C';
  }
});
