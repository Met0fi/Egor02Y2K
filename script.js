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

  function plantGifs() {
    if (document.getElementById("egifLayer")) return;
    if (root.dataset.page === "cake") return;
    var layer = document.createElement("div");
    layer.id = "egifLayer";
    layer.setAttribute("aria-hidden", "true");
    var pack = [
      ["egif egif-star", "data:image/gif;base64,R0lGODlhDQANAIEAAAgIDuTWsP//5gAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJFAAAACwAAAAADQANAAAINQABCBwYYKDBgwUPCkwIgCHDhRAbKpRY8CHCABYxagwgYCPGixYNVpSoMKFJhARTTgxZUmFAACH5BAkOAAAALAAAAAANAA0AgQgIDnhuUAAAAAAAAAgrAAEIHBhgoMGDBQ8qTKjQIMOGAh9ClAgggMWLGC8uhOiQI0GPEUFWFEkxIAAh+QQJFAAAACwAAAAADQANAIEICA7k1rD//+YAAAAINQABCBwYYKDBgwUPCkwIgCHDhRAbKpRY8CHCABYxagwgYCPGixYNVpSoMKFJhARTTgxZUmFAACH5BAkJAAAALAAAAAANAA0AgQgIDgAAAAAAAAAAAAgXAAEIHEiwoMGDCBMqXMiwocOHECNCDAgAOw=="],
      ["egif egif-drip", "data:image/gif;base64,R0lGODlhCgAcAIEAAAgIDqAMHFoEDgAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJEgAAACwAAAAACgAcAAAIOQABCAxAMIDAgwAKGkSYsCDDhgQfKmSoMOLBigsHVkSIkaJDiRkZCnhIsqTJkyhTqlzJsqXLlyYDAgAh+QQJEgAAACwAAAAACgAcAIEICA6gDBxaBA4AAAAIPQABCAxAMIDAgwAKGkSYsCDDhgQfKnyYkOJAiw0pTkSoMOLBjgsHduQ4kqRHhicZCsDIsqXLlzBjypxpMSAAIfkECRIAAAAsAAAAAAoAHACBCAgOoAwcWgQOAAAACEIAAQgMQDCAwIMAChpEmLAgw4YEHyp8mJDiQIsVLS6kuFEixogSHSJUCHIgyZEnD5LsCJGlSYsCMMqcSbOmzZsAAgIAIfkECRIAAAAsAAAAAAoAHACBCAgOoAwcWgQOAAAACEQAAQgMQDCAwIMAChpEmLAgw4YEHyp8mJDiQIsVLS6kuFEixo4MQSIUeZDkQJITRyrsuJLlSpUpSzqUaFIAxps4cx4MCAAh+QQJHAAAACwAAAAACgAcAIEICA6gDBxaBA4AAAAIRAABCAxAMIDAgwAKGkSYsCDDhgQfKnyYkOJAixUtLqS4USLGjgxBIhR5kORFjR9TaiQ5caTCji9hvnTZsqRDiSYFMAwIADs="],
      ["egif egif-bat", "data:image/gif;base64,R0lGODlhIAAUAIEAAAgIDhwSJAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJDAAAACwAAAAAIAAUAAAIYAABCBxIsKDBgwgTKly4MEBBhwwZBoAIYGLEiBQpXlQ4seNFjQg7Wmwo0GNIkQlNVhQJcqXKgSw1xhzpkuZMkDdz6jSosydKnjx3PtxY8yXRhzGPpvyp9GTLplCjSpUaEAAh+QQJCgAAACwAAAAAIAAUAIEICA4cEiQAAAAAAAAIVwABCBxIsKDBgwgTKly4MEBBhwwZBoAIYGLEiBQpXlQ4seNGiR01fjwYUuTIhyFPJiy5saTLlzA9DoxJE6bBmjgt3sxZE6HJii5JnmSp0qfOokiTKk0aEAAh+QQJDAAAACwAAAAAIAAUAIEICA4cEiQAAAAAAAAIWgABCBxIsKDBgwgTKly4MEBBhwwZBoAIYGLEiBQpXlQ4seNGiR01fjwYUuTIhyFPJiypkmRJkyNfsowpsyZMgzZzWnT5UqBMnz9xeiQ4c2BKjjxJtlzKtOnHgAAh+QQJCgAAACwAAAAAIAAUAIEICA4cEiQAAAAAAAAIVwABCBxIsKDBgwgTKly4MEBBhwwZBoAIYGLEiBQpXlQ4seNGiR01fjwYUuTIhyFPJiy5saTLlzA9DoxJE6bBmjgt3sxZE6HJii5JnmSp0qfOokiTKk0aEAA7"],
      ["egif egif-candle", "data:image/gif;base64,R0lGODlhCQASAIEAAAgIDuTWsP+0PAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQAAACwAAAAACQASAAAINgABCBxIcKCAggIFKESo8CDBhgsfRpTosGBFggEEBEAYoCNHjwU7bgwJEmPJgSI/jjS5EmXJgAAh+QQJCwAAACwAAAAACQASAIEICA7k1rD/0loAAAAIOQABCAQgYKBBggcHCih4cCFDgw4fCozYcGFCghIFBhAQIGGAjx5BHvzYcaRIgyRDlkR5cmBKkysDAgAh+QQJCAAAACwAAAAACQASAIEICA7k1rDcUCgAAAAINgABCBxIsKBBgQIOCkhYcCHDgQ4XNnQ48eHAAAICGAzAcWPHghw1gvxIMKRHkSVJXlQp0KTAgAAh+QQJCgAAACwAAAAACQASAIEICA7k1rD/0loAAAAIOQABCAQgYKBBggcHCih4cCFDgw4fCozYcGFCghIFBhAQIGGAjx5BHvzYcaRIgyRDlkR5cmBKkysDAgA7"],
      ["egif egif-mail", "data:image/gif;base64,R0lGODlhGAAQAIEAAObk8ggIDiooOAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJKgABACwAAAAAGAAQAAAIXAADCBxIsKDBgwgTKlx4UIDDhxAjShQg8CGAixgzagTwsOJFARtDcvzo8SNIkRxPciyJ0WFIlSQDwGypceZKmSJdutxIESdKmy1ZoswpdCjPokYz9pzIdCLDpwEBACH5BAkcAAIALAAAAAAYABAAgebk8iooOAgIDsmUoAhmAAUIHEhQQICDBRMmPHhwgEOGCgcyDOCwosUBEwlO3Mixo0CGAEKKHEkSAESDIQOUXGky5UeRB1mmVOkS5ciYJWnCfJmTpM6dNnOqxOmTJ8ufRYPKPGp06coATZ0m7UjVY8SrCgMCADs="],
      ["egif egif-wait", "data:image/gif;base64,R0lGODlhWAAMAIEAAFoUIBAQFuTWsAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQIDgAAACwAAAAAWAAMAAAIpQAFCBxIsKDBgwgTKlzIUCGAhxADSAwAMeLEig8nUsSoESOAjhwvhpToEWTFAAJLijy50iLJkRtZvpQZ02XNjC0fpoSpcqbNnjc/5hTqE2dRokEFBjX5k6dTmkCjPoUo4ChTo0uHXkUqFepUAFWzWtVKdqxZsWgxhk37lWvbrXDL3ox7tmtTr3jv6qXLNi9Wu3/f5uQL2K1fw3oDe23IuLHjxw0DAgAh+QQIDgAAACwAAAAAWAAMAIFaFCAQEBbk1rAAAAAInwAFCBxIsKDBgwgTKlzIcGGAAAAiSnz4UOJEihYjUoSYcWNGAB47YhRZkSRHiQJGWgy5UuXFki1hvjw58yPLmihdatQJkufNnTKB0hRq06fOnz2DJh26tKhSpFCNBo36VCpTqletOqWJdatXk19jZq06VSvYs2LD4kyLlmhbt2zjrp0L96UAuXXzNn27F29fu3y7BjbrN2rDw4gTKz4cEAAh+QQIDgAAACwAAAAAWAAMAIFaFCAQEBbk1rAAAAAIpAAFCBxIsKDBgwgTKlzIUCEAAAEiBnhIEaLEig8lTsSoEaPFiB47crw4EmTJjRRFVlSZkuRKly1NvpQZE2XNkDBZZoS5k2ZPmz9x+vwIlKhQoDqNnjzKdKnTmUUlCnh6k2pQq0qhNn05VSvWpGB5Zq3qletWsmivlk07Vm1KgWfdym1LN+zQpHC/irUbda/fu2IF9gVMeLDhuHUDN1zMuLFjhgEBACH5BAgOAAAALAAAAABYAAwAgVoUIBAQFuTWsAAAAAinAAUIHEiwoMGDCBMqXMhQIYCHDwNIDAAR4kSKFQFczKhxIseNGUFWFGnRY8gAAj6aHLmypESVL0/GZDnTJUaaNy2mlJkzYkufNYH27BiU6FCSQj8KhHn0p1GmUHlGxclRYNOiSJ9K3UqVq82qV8NO/eo1aVmtFQVgdZq1Ldu3a+P2VCt3rNmueMnmvQuArtizbusChtsz8N+9aPUq5nu3oePHkCM3DAgAOw=="]
    ];
    pack.forEach(function (item) {
      var img = document.createElement("img");
      img.className = item[0];
      img.src = item[1];
      img.alt = "";
      img.draggable = false;
      layer.appendChild(img);
    });
    document.body.appendChild(layer);
  }

  plantGifs();
  if (number("egor02_finale") === 1) window.startFracture(false);
})();
