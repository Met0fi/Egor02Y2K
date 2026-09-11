const themeButton = document.querySelector('#themeButton');
const visitorCount = document.querySelector('#visitorCount');
const guestbookForm = document.querySelector('#guestbookForm');
const guestbookMessage = document.querySelector('#guestbookMessage');
const fileViewer = document.querySelector('#fileViewer');
const fileRows = document.querySelectorAll('.file-row');
const factButtons = document.querySelectorAll('.fact-button');
let visitorNumber = Number.parseInt(visitorCount.textContent, 10);

const fileNotes = {
  nightlog: 'NIGHTLOG_1998.TXT\n\n02:13 — в окне снова кто-то стоит.\n02:14 — окна у этой комнаты нет.\n02:15 — запись остановлена.',
  fieldnotes: 'FIELDNOTES_03.TXT\n\nКожа холоднее, чем ожидаешь.\nГолос тихий, но слышен через стену.\nСледов обуви не найдено.',
  warning: 'WARNING_FINAL.TXT\n\nЕсли архив начал отвечать сам, закрой вкладку.\nЕсли не помогло — выключи свет.\nЕсли не помогло — удачи.'
};

factButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    answer.textContent = button.dataset.answer;
    answer.classList.toggle('visible');
    button.textContent = answer.classList.contains('visible') ? 'скрыть пометку' : 'показать пометку';
  });
});

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('body-alt');
  themeButton.textContent = document.body.classList.contains('body-alt') ? 'вернуть красный' : 'сменить оттенок';
});

fileRows.forEach((row) => {
  row.addEventListener('click', () => {
    fileViewer.textContent = fileNotes[row.dataset.file];
  });
});

guestbookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#guestName').value.trim();
  const message = document.querySelector('#guestMessage').value.trim();
  if (!name || !message) {
    guestbookMessage.textContent = 'Нужны подпись и сообщение.';
    return;
  }
  visitorNumber += 1;
  visitorCount.textContent = String(visitorNumber).padStart(6, '0');
  guestbookMessage.textContent = `${name}: записка приклеена к стене.`;
  guestbookForm.reset();
});

