const factButtons = document.querySelectorAll(".fact-button");
const quietNote = document.querySelector("#quiet-note");
const counter = document.querySelector("#counter");
const horrorOverlay = document.querySelector("#horror-overlay");
const closeHorror = document.querySelector("#close-horror");
const guestbookForm = document.querySelector("#guestbook-form");
const guestbookStatus = document.querySelector("#guestbook-status");

let revealedFacts = 0;
let counterClicks = 0;

function revealFact(button) {
    const card = button.closest(".fact-card");
    const isOpen = card.classList.toggle("is-open");

    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "Скрыть факт" : "Открыть факт";

    if (isOpen) {
        revealedFacts += 1;
    } else {
        revealedFacts -= 1;
    }

    if (revealedFacts === factButtons.length) {
        quietNote.hidden = false;
        document.body.classList.add("haunted");
    }
}

function openHorrorWindow() {
    horrorOverlay.hidden = false;
    closeHorror.focus();
}

function closeHorrorWindow() {
    horrorOverlay.hidden = true;
    counter.focus();
}

function handleCounterClick() {
    counterClicks += 1;

    if (counterClicks === 1) {
        counter.textContent = "visitors: 000014";
    }

    if (counterClicks === 2) {
        counter.textContent = "visitors: 000014";
    }

    if (counterClicks >= 3 && revealedFacts === factButtons.length) {
        openHorrorWindow();
    }
}

function handleGuestbookSubmit(event) {
    event.preventDefault();

    const name = document.querySelector("#visitor-name").value.trim();

    if (!name) {
        guestbookStatus.textContent = "Сначала напиши своё имя.";
        return;
    }

    guestbookStatus.textContent = `Спасибо, ${name}. Запись сохранена до следующего обновления страницы.`;
    guestbookForm.reset();
}

factButtons.forEach((button) => {
    button.addEventListener("click", () => revealFact(button));
});

counter.addEventListener("click", handleCounterClick);

counter.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCounterClick();
    }
});

closeHorror.addEventListener("click", closeHorrorWindow);

horrorOverlay.addEventListener("click", (event) => {
    if (event.target === horrorOverlay) {
        closeHorrorWindow();
    }
});

guestbookForm.addEventListener("submit", handleGuestbookSubmit);
