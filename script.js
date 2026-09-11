const clickMessage = document.querySelector('#clickMessage');
const moodButton = document.querySelector('.mood-button');
const doorButton = document.querySelector('#doorButton');
const doorScene = document.querySelector('.door-scene');
const doorMessage = document.querySelector('#doorMessage');
const guestbookForm = document.querySelector('#guestbookForm');
const guestbookMessage = document.querySelector('#guestbookMessage');
const visitorCount = document.querySelector('#visitorCount');
const findingButtons = document.querySelectorAll('.tiny-button[data-message]');

let doorIsOpen = false;
let visitorNumber = Number.parseInt(visitorCount.textContent, 10);

findingButtons.forEach((button) => {
  button.addEventListener('click', () => {
    clickMessage.textContent = button.dataset.message;
  });
});

moodButton.addEventListener('click', () => {
  document.body.classList.toggle('alt-mood');
  const isAltMood = document.body.classList.contains('alt-mood');
  moodButton.textContent = isAltMood ? 'вернуть прежний цвет' : 'нажать осторожно';
  clickMessage.textContent = isAltMood ? 'Страница надела другой свитер.' : 'Страница снова в привычном свитере.';
});

doorButton.addEventListener('click', () => {
  doorIsOpen = !doorIsOpen;
  doorScene.classList.toggle('open', doorIsOpen);
  doorButton.setAttribute('aria-expanded', String(doorIsOpen));
  doorButton.textContent = doorIsOpen ? 'закрыть тихо' : 'проверить ручку';
  doorMessage.textContent = doorIsOpen ? 'В комнате играет радио. Оно ловит только прогноз погоды за 2002 год.' : 'Дверь снова стоит ровно. Почти.';
});

guestbookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#guestName').value.trim();
  const message = document.querySelector('#guestMessage').value.trim();

  if (!name || !message) {
    guestbookMessage.textContent = 'Нужны и подпись, и хотя бы пара слов.';
    return;
  }

  visitorNumber += 1;
  visitorCount.textContent = String(visitorNumber).padStart(6, '0');
  guestbookMessage.textContent = `${name}, записка приклеена. Стена всё запомнила.`;
  guestbookForm.reset();
});

