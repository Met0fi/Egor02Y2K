const randomFactButton = document.querySelector('#randomFactButton');
const randomFactBox = document.querySelector('#randomFactBox');
const vampireFaces = document.querySelectorAll('.vampire-face');

const randomFacts = [
  'Carmilla появилась в печати в 1872 году — за 25 лет до Dracula Брэма Стокера.',
  'The Vampyre Джона Полидори вышел в 1819 году. Dracula не был первым литературным вампиром.',
  'Nosferatu (1922) был неофициальной экранизацией Dracula. Граф Дракула там стал графом Орлоком.',
  'Смертельный солнечный свет — не универсальное старое правило. Nosferatu сильно помог закрепить его в кино.',
  'Вампировых летучих мышей существует три современных вида, и все они живут в Америках.',
  'Вампировая летучая мышь делает небольшой надрез и слизывает кровь, а не высасывает её как через трубочку.',
  'В XIX веке в Новой Англии вскрывали могилы умерших родственников во время вспышек туберкулёза, опасаясь «вампиров».',
  'Кол, чеснок, зеркало, приглашение в дом и гроб никогда не были единым сводом правил для всех вампирских историй.'
];

function showRandomFact() {
  const index = Math.floor(Math.random() * randomFacts.length);
  randomFactBox.textContent = randomFacts[index];
}

function toggleNightmare() {
  document.body.classList.toggle('nightmare');
}

randomFactButton.addEventListener('click', showRandomFact);
vampireFaces.forEach((face) => face.addEventListener('click', toggleNightmare));
