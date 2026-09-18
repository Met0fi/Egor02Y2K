const mythButtons = document.querySelectorAll('.myth-button');
const mythAnswer = document.querySelector('#mythAnswer');
const visitorCounter = document.querySelector('#visitorCounter');
const body = document.body;

function showMythAnswer(button) {
  const answer = button.dataset.answer;
  if (!answer || !mythAnswer) return;
  mythAnswer.textContent = answer;
}

function readVisitCount() {
  const stored = Number(localStorage.getItem('egor02VampireVisits') || 0);
  return Number.isFinite(stored) ? stored : 0;
}

function updateVisitorCounter() {
  const nextVisit = readVisitCount() + 1;
  localStorage.setItem('egor02VampireVisits', String(nextVisit));
  if (visitorCounter) visitorCounter.textContent = 'visitor ' + String(nextVisit).padStart(6, '0');
  return nextVisit;
}

function decayFromScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
  return Math.min(4, Math.floor(progress * 5));
}

function applyDecay(baseDecay) {
  const level = Math.max(baseDecay, decayFromScroll());
  body.dataset.decay = String(level);
}

const visits = updateVisitorCounter();
const baseDecay = Math.min(4, Math.floor(Math.max(0, visits - 1) / 2));
let frameRequested = false;

mythButtons.forEach((button) => {
  button.addEventListener('click', () => showMythAnswer(button));
});

window.addEventListener('scroll', () => {
  if (frameRequested) return;
  frameRequested = true;
  requestAnimationFrame(() => {
    applyDecay(baseDecay);
    frameRequested = false;
  });
}, { passive: true });

applyDecay(baseDecay);
