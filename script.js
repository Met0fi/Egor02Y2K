const breakSwitch = document.querySelector('#breakSwitch');
const memoryViewer = document.querySelector('#memoryViewer');
const wallForm = document.querySelector('#wallForm');
const wallName = document.querySelector('#wallName');
const wallMessage = document.querySelector('#wallMessage');
const wallEntries = document.querySelector('#wallEntries');
const tinyWindow = document.querySelector('.window-one');
const closeWindow = document.querySelector('.x-button');

const memories = {
  a: 'обрывок 01\n\nВ коридоре снова синий свет. Лампа обычная. Значит, дело не в лампе.',
  b: 'egor_final_final2.bmp\n\nФайл с таким названием не найден. Осталось только имя файла, и почему-то этого достаточно.',
  c: 'листок из тетради\n\n«не звонить после школы»\nни номера, ни подписи рядом нет.',
  d: 'папка: НЕ УДАЛЯТЬ\n\nвнутри: рисунки, которые я не помню как рисовал, и пустая папка с названием «потом».',
  e: 'год не подтверждён\n\n2002? 2003? Я оставил вопросительный знак и перестал проверять.'
};

function setBrokenState() {
  document.body.classList.toggle('memory-broken');
  const broken = document.body.classList.contains('memory-broken');
  breakSwitch.textContent = broken ? 'ВЕРНУТЬ КРИВО, НО ИНАЧЕ' : 'СЛОМАТЬ ЕЩЁ СИЛЬНЕЕ';
}

function showMemory(key) {
  if (!memories[key]) return;
  memoryViewer.textContent = memories[key];
}

function getWallEntries() {
  try {
    const value = JSON.parse(localStorage.getItem('egor02Wall') || '[]');
    return Array.isArray(value) ? value.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function saveWallEntries(entries) {
  localStorage.setItem('egor02Wall', JSON.stringify(entries.slice(0, 6)));
}

function renderWallEntries(entries) {
  wallEntries.replaceChildren();
  entries.forEach((entry) => {
    const row = document.createElement('div');
    const name = document.createElement('b');
    const text = document.createElement('span');
    row.className = 'wall-entry';
    name.textContent = entry.name + ': ';
    text.textContent = entry.message;
    row.append(name, text);
    wallEntries.append(row);
  });
}

breakSwitch.addEventListener('click', setBrokenState);

document.querySelectorAll('.fragment').forEach((fragment) => {
  fragment.addEventListener('click', () => showMemory(fragment.dataset.memory));
});

closeWindow.addEventListener('click', () => {
  tinyWindow.hidden = true;
});

const initialEntries = getWallEntries();
renderWallEntries(initialEntries);

wallForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = wallName.value.trim() || '???';
  const message = wallMessage.value.trim();
  if (!message) return;
  const entries = [{ name, message }, ...getWallEntries()];
  saveWallEntries(entries);
  renderWallEntries(entries);
  wallForm.reset();
});
