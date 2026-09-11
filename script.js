document.addEventListener('DOMContentLoaded', function() {
    // Кнопки фактов
    const factButtons = document.querySelectorAll('.fact-btn');
    factButtons.forEach(button => {
        button.addEventListener('click', function() {
            const info = this.getAttribute('data-info');
            const infoParagraph = this.nextElementSibling;
            if (infoParagraph && infoParagraph.classList.contains('fact-info')) {
                infoParagraph.textContent = infoParagraph.textContent ? '' : info;
            }
        });
    });

    // Кнопка смены темы
    const themeButton = document.getElementById('themeButton');
    if (themeButton) {
        themeButton.addEventListener('click', function() {
            document.body.style.backgroundColor = 
                document.body.style.backgroundColor === 'rgb(245, 245, 245)' ? '' : '#f5f5f5';
        });
    }

    // Форма гостевой книги
    const form = document.getElementById('guestbookForm');
    const message = document.getElementById('formMessage');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = form.querySelector('[name="name"]').value;
            const text = form.querySelector('[name="message"]').value;
            
            if (name && text) {
                message.textContent = 'Спасибо, ' + name + '! Ваше сообщение сохранено.';
                form.reset();
            }
        });
    }
});
