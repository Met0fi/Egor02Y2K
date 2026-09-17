const mythButtons = document.querySelectorAll('.myth-button');
const mythAnswer = document.querySelector('#mythAnswer');
const visitorCounter = document.querySelector('#visitorCounter');

function showMythAnswer(button) {
  const answer = button.dataset.answer;
  if (!answer || !mythAnswer) return;
  mythAnswer.textContent = answer;
}

function updateVisitorCounter() {
  if (!visitorCounter) return;
  const nextVisit = Number(localStorage.getItem('egor02VampireVisits') || 0) + 1;
  localStorage.setItem('egor02VampireVisits', String(nextVisit));
  visitorCounter.textContent = 'visitor ' + String(nextVisit).padStart(6, '0');
}

mythButtons.forEach((button) => {
  button.addEventListener('click', () => showMythAnswer(button));
});

updateVisitorCounter();
