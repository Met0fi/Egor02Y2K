(function () {
  "use strict";

  var VISITS = "egor02_visits";
  var SECRETS = "egor02_secrets";
  var KEYS = "egor02_keys";
  var RIFT = "egor02_rift";
  var NOTES = "egor02_guestbook";
  var root = document.documentElement;
  var path = location.pathname.toLowerCase();

  function json(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || "null");
      return Array.isArray(value) ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }

  function number(key) {
    var value = Number(localStorage.getItem(key) || 0);
    return Number.isFinite(value) ? value : 0;
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim().replace(/ё/g, "е").replace(/[\s.\-]/g, "");
  }

  function addUnique(key, value) {
    var values = json(key, []);
    if (values.indexOf(value) === -1) {
      values.push(value);
      save(key, values);
    }
    return values;
  }

  function riftUp(value) {
    var next = Math.min(8, Math.max(number(RIFT), value || 0));
    try { localStorage.setItem(RIFT, String(next)); } catch (error) {}
    root.dataset.rift = String(next);
    return next;
  }

  var visits = number(VISITS) + 1;
  try { localStorage.setItem(VISITS, String(visits)); } catch (error) {}
  var decay = visits > 7 ? 4 : visits > 4 ? 3 : visits > 2 ? 2 : visits > 1 ? 1 : 0;
  var keys = json(KEYS, []);
  var secrets = json(SECRETS, []);
  var rift = number(RIFT);
  root.dataset.decay = String(decay);
  root.dataset.rift = String(rift);
  document.title = root.dataset.page === "cake" ? "01.10.????" : "Vamprie?02";

  function gain(key) {
    keys = addUnique(KEYS, key);
    if (key !== "cake" && rift < 7) rift = riftUp(Math.min(6, Math.floor(keys.length / 2)));
    return keys;
  }

  function secret(key) {
    secrets = addUnique(SECRETS, key);
    return secrets;
  }

  document.querySelectorAll("[data-secret]").forEach(function (element) {
    element.addEventListener("click", function () {
      secret(element.getAttribute("data-secret"));
      var dot = document.getElementById("footDot");
      if (dot && secrets.length >= 3) dot.hidden = false;
    });
  });

  var oldLink = document.getElementById("oldLink");
  if (oldLink && (decay >= 2 || rift >= 2)) oldLink.hidden = false;

  var counter = document.getElementById("hitCounter");
  if (counter) {
    var leds = document.getElementById("leds");
    var digits = String(Math.max(41, visits + 40)).padStart(6, "0");
    if (leds && !leds.children.length) {
      digits.split("").forEach(function (digit) {
        var led = document.createElement("span");
        led.className = "led";
        led.textContent = digit;
        leds.appendChild(led);
      });
    }
    var taps = 0;
    counter.addEventListener("click", function () {
      taps += 1;
      if (taps >= 5) {
        gain("counter");
        secret("counter");
        location.href = "log.html";
      }
    });
  }

  var midi = document.getElementById("midiDead");
  if (midi) {
    var midiTaps = 0;
    midi.addEventListener("click", function () {
      midiTaps += 1;
      if (midiTaps >= 3) {
        gain("midi");
        var message = document.getElementById("midiMsg");
        if (message) message.textContent = "файл на месте. звук спрятан в шуме.";
      }
    });
  }

  function renderNotes() {
    var box = document.getElementById("guestExtra");
    if (!box) return;
    box.replaceChildren();
    json(NOTES, []).slice(-12).forEach(function (note) {
      var row = document.createElement("div");
      row.className = "note-row";
      var head = document.createElement("b");
      head.textContent = (note.date || "") + " · " + (note.name || "аноним");
      var body = document.createElement("div");
      body.textContent = note.text || "";
      row.appendChild(head);
      row.appendChild(body);
      box.appendChild(row);
    });
  }

  var guestForm = document.getElementById("guestForm");
  if (guestForm) {
    renderNotes();
    guestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = String(guestForm.elements.name.value || "").trim().slice(0, 32);
      var text = String(guestForm.elements.text.value || "").trim().slice(0, 180);
      var flash = document.getElementById("guestFlash");
      var code = normalize(text);
      if (!text) {
        if (flash) flash.textContent = "пустую запись не приклею";
        return;
      }
      if (/petar|петар|blago|благо/.test(normalize(name))) {
        gain("petar");
        secret("kisiljevo");
        if (flash) flash.textContent = "имя совпало с рапортом. теперь ищи дату.";
      } else if (code === "уголь" || code === "coal") {
        gain("coal");
        if (flash) flash.textContent = "уголь найден. это не пароль.";
      } else if (code === "бефана" || code === "befana") {
        gain("befana");
        if (flash) flash.textContent = "бефана приносит уголь. второе слово рядом.";
      } else if (code === "0408" || code === "04082004") {
        gain("date");
        if (flash) flash.textContent = "день верный. год можно оставить за дверью.";
      } else if (code === "егорвампирокурки" || code === "egrrrtl3nie") {
        gain("oven");
        riftUp(7);
        if (flash) flash.textContent = "печь услышала. кухня открыта.";
      } else if (flash) {
        flash.textContent = "запись приклеена.";
      }
      var notes = json(NOTES, []);
      notes.push({ name: name || "аноним", text: text, date: new Date().toLocaleDateString("ru-RU") });
      save(NOTES, notes.slice(-24));
      guestForm.reset();
      renderNotes();
    });
  }

  function bindPassword(id, outputId) {
    var form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = normalize(form.elements.pass && form.elements.pass.value);
      var output = document.getElementById(outputId);
      if (value === "бефана0408" || value === "befana0408") {
        gain("oven");
        riftUp(7);
        location.href = "kitchen.html";
        return;
      }
      if (value === "егорвампирокурки" || value === "egrrrtl3nie") {
        gain("oven");
        gain("kurki");
        riftUp(7);
        location.href = "kitchen.html";
        return;
      }
      if (value === "уголь" || value === "coal") gain("coal");
      else if (value === "бефана" || value === "befana") gain("befana");
      else if (value === "0408" || value === "04082004") gain("date");
      else if (value === "1725") gain("year");
      if (output) output.textContent = "403 forbidden";
    });
  }

  bindPassword("ovenForm", "ovenFlash");
  bindPassword("commitForm", "commitFlash");

  if (path.indexOf("kisiljevo") !== -1) {
    gain("kisil");
    secret("kisiljevo");
    var again = document.getElementById("again");
    if (again && (decay >= 2 || rift >= 2)) again.hidden = false;
  }
  if (path.indexOf("old.html") !== -1) { gain("old"); secret("old"); }
  if (path.indexOf("cgi-bin") !== -1) { gain("cgi"); secret("cgi"); }
  if (path.indexOf("fangs") !== -1) gain("fangs");
  if (path.indexOf("bats") !== -1) gain("bats");
  if (path.indexOf("glaza") !== -1) gain("glaza");
  if (path.indexOf("memories") !== -1) gain("memory");
  if (path.indexOf("teeth") !== -1) gain("teeth");

  var dot = document.getElementById("footDot");
  if (dot && (secrets.length >= 3 || keys.length >= 4)) dot.hidden = false;

  var log = document.getElementById("accessLog");
  if (log) log.textContent = "04/Aug/2004 03:17  GET /oven.cgi  403\n" +
    "21/Jul/1725  --:--  GET /kisiljevo.htm\n" +
    "04/Aug/2004 03:18  PUT /cake.html  ?\n" +
    "visits=" + visits + "  keys=" + keys.join(",");

  var you = document.getElementById("youRoot");
  if (you) {
    secret("you");
    if (secrets.length < 3 && keys.length < 4) {
      you.innerHTML = '<p>пустой каталог.</p><p><a href="index.html">index.html</a></p>';
    } else {
      gain("you");
      you.innerHTML = '<h1>не тот адрес</h1><p>04.08.2004, 03:17. Егор оставил в кухне торт. Печь ждёт слово и день без года.</p><p><a href="oven.html">oven.cgi</a> · <a href="index.html">index.html</a></p>';
    }
  }

  var ledger = document.getElementById("ledgerForm");
  if (ledger) {
    var sheets = new Set();
    var sheetText = {
      "1": "1725. Петар Благоевич. Кисилево.",
      "2": "Рапорт составлял Фромбальд. Его имя не часть пароля.",
      "3": "Бефана приносит уголь. Это содержимое ящика, не торта.",
      "4": "04.08.2004. На печи оставили только день и месяц."
    };
    document.querySelectorAll("[data-ledger-page]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        sheets.add(tab.dataset.ledgerPage);
        tab.setAttribute("aria-pressed", "true");
        document.getElementById("ledgerStatus").textContent = "листов просмотрено: " + sheets.size + " из 4";
        document.getElementById("ledgerScrap").textContent = sheetText[tab.dataset.ledgerPage];
        document.getElementById("ledgerLock").hidden = sheets.size === 4;
        ledger.hidden = sheets.size !== 4;
      });
    });
    ledger.addEventListener("submit", function (event) {
      event.preventDefault();
      var values = ["year", "name", "word", "date"].map(function (field) { return normalize(ledger.elements[field].value); });
      var correct = values[0] === "1725" && (values[1] === "фромбальд" || values[1] === "frombald") &&
        (values[2] === "уголь" || values[2] === "coal") && values[3] === "0408";
      document.getElementById("ledgerFlash").textContent = correct ? "сходится." : "один из листов не сходится.";
      if (correct) { gain("ledger"); document.getElementById("ledgerNext").hidden = false; }
    });
  }

  var reset = document.getElementById("resetCounter");
  if (reset) reset.addEventListener("click", function () {
    [VISITS, SECRETS, KEYS, RIFT, NOTES, "egor02_finale"].forEach(function (key) { try { localStorage.removeItem(key); } catch (error) {} });
    location.href = "index.html";
  });

  if (path.indexOf("kitchen") !== -1) {
    var gate = document.getElementById("kitchenGate");
    var room = document.getElementById("kitchenRoom");
    var unlocked = keys.indexOf("oven") !== -1 || rift >= 7;
    if (gate) gate.hidden = unlocked;
    if (room) room.hidden = !unlocked;
    if (unlocked) gain("kitchen");
  }

  var cake = document.getElementById("cakeButton");
  if (cake && root.dataset.page === "cake") {
    if (keys.indexOf("oven") === -1 && rift < 7) location.replace("kitchen.html");
    cake.addEventListener("click", function () {
      gain("cake");
      riftUp(8);
      try { localStorage.setItem("egor02_finale", "1"); } catch (error) {}
      window.startFracture(true);
    });
  }
  if (number("egor02_finale") === 1) window.startFracture(false);
})();
