document.addEventListener('DOMContentLoaded', () => {
    const factButtons = document.querySelectorAll('.fact-button');

    factButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.fact-card');
            const answer = card.querySelector('.fact-answer');
            const factText = button.dataset.fact;

            const isOpened = answer.classList.contains('visible');

            if (isOpened) {
                answer.textContent = '';
                answer.classList.remove('visible');
                button.textContent = 'Открыть факт';
            } else {
                answer.textContent = factText;
                answer.classList.add('visible');
                button.textContent = 'Скрыть факт';
            }
        });
    });
    const themeButton = document.querySelector('#themeButton');

    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('soft-mode');

        if (document.body.classList.contains('soft-mode')) {
            themeButton.textContent = '☼ вернуть ночь';
        } else {
            themeButton.textContent = '☾ сменить настроение';
        }
    });
    const guestbookForm = document.querySelector('#guestbookForm');
    const formMessage = document.querySelector('#formMessage');

    guestbookForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = document.querySelector('#guestName');
        const messageInput = document.querySelector('#guestMessage');

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) {
            formMessage.textContent = 'Заполни оба поля, ночной гость.';
            return;
        }

        const guestbookEntry = {
            name,
            message,
            date: new Date().toLocaleDateString('ru-RU')
        };

        localStorage.setItem(
            'vampireGuestbookEntry',
            JSON.stringify(guestbookEntry)
        );

        formMessage.textContent =
            `Спасибо, ${name}! Твоё послание осталось в ночном архиве.`;

        guestbookForm.reset();
    });
});
