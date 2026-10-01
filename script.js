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

  function sessionValue(key) {
    try { return sessionStorage.getItem(key) || ""; } catch (error) { return ""; }
  }

  function sessionSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (error) {}
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

  var cvsFromBadbat = document.getElementById("cvsFromBadbat");
  if (cvsFromBadbat) cvsFromBadbat.addEventListener("click", function () {
    sessionSet("egor02_cvs_seen", "1");
  });

  var cgiEntry = document.getElementById("cgiEntry");
  if (cgiEntry) cgiEntry.addEventListener("click", function () {
    sessionSet("egor02_cgi_ready", "1");
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
    counter.addEventListener("click", function () {
      gain("counter");
      secret("counter");
      location.href = "log.html";
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
      if (id === "ovenForm" && (value === "бефана6" || value === "befana6")) {
        gain("oven");
        riftUp(7);
        sessionSet("egor02_befana6", "1");
        location.href = "kitchen.html";
        return;
      }
      if (id === "commitForm" && (value === "егорвампирокурки" || value === "egrrrtl3nie")) {
        sessionSet("egor02_wrong_route", "1");
        window.alert("...!!! Стремление к цели привело тебя не туда");
        location.replace("wrong.html");
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

  if (path.indexOf("cgi-bin") !== -1) {
    var cgiAllowed = sessionValue("egor02_cvs_seen") === "1" && sessionValue("egor02_cgi_ready") === "1";
    if (!cgiAllowed) {
      location.replace("index.html");
    } else {
      sessionSet("egor02_cgi_console", "1");
      sessionSet("egor02_cvs_seen", "0");
      sessionSet("egor02_cgi_ready", "0");
      window.alert("Вы открыли консоль CGI-BIN. Привет, Егор!");
      location.replace("commits.html");
    }
  }

  if (path.indexOf("commits.html") !== -1) {
    if (sessionValue("egor02_cgi_console") !== "1") {
      location.replace("index.html");
    } else {
      sessionSet("egor02_cgi_console", "0");
    }
  }

  if (path.indexOf("kisiljevo") !== -1) {
    gain("kisil");
    secret("kisiljevo");
    var again = document.getElementById("again");
    if (again && (decay >= 2 || rift >= 2)) again.hidden = false;
  }
  if (path.indexOf("old.html") !== -1) { gain("old"); secret("old"); }
  if (path.indexOf("cgi-bin") !== -1) { secret("cgi"); }
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
      you.innerHTML = '<h1>не тот адрес</h1><p>04.08.???????????, 03:17. Егор оставил на кухне что-то...</p><p><a href="oven.html">oven.cgi</a> · <a href="index.html">index.html</a></p>';
    }
  }

  var ledger = document.getElementById("ledgerForm");
  if (ledger) {
    var sheets = new Set();
    var sheetText = {
      "1": "1725. Петар Благоевич. Кисилево.",
      "2": "Рапорт составлял Фромбальд.",
      "3": "Бефана приносит уголь.",
      "4": "04.08.2004. На печи оставили только день и месяц."
    };
    document.querySelectorAll("[data-ledger-page]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        sheets.add(tab.dataset.ledgerPage);
        tab.setAttribute("aria-pressed", "true");
        document.getElementById("ledgerStatus").textContent = "листов просмотрено: " + sheets.size + " из 4";
        document.getElementById("ledgerScrap").textContent = sheetText[tab.dataset.ledgerPage];
      });
    });
    ledger.addEventListener("submit", function (event) {
      event.preventDefault();
      var values = ["year", "name"].map(function (field) { return normalize(ledger.elements[field].value); });
      var correct = values[0] === "1725" && (values[1] === "фромбальд" || values[1] === "frombald");
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
    var unlocked = sessionValue("egor02_befana6") === "1";
    if (gate) gate.hidden = unlocked;
    if (room) room.hidden = !unlocked;
    if (unlocked) gain("kitchen");
  }

  var cake = document.getElementById("cakeButton");
  if (cake && root.dataset.page === "cake") {
    if (sessionValue("egor02_befana6") !== "1") location.replace("kitchen.html");
    cake.addEventListener("click", function () {
      gain("cake");
      riftUp(8);
      try { localStorage.setItem("egor02_finale", "1"); } catch (error) {}
      var credit = document.getElementById("cakeCredit");
      if (credit) credit.hidden = false;
      window.startFracture(true);
    });
  }

  function plantGifs() {
    if (document.getElementById("egifLayer")) return;
    if (!document.querySelector('link[href="egif.css"]')) {
      var sheet = document.createElement("link");
      sheet.rel = "stylesheet";
      sheet.href = "egif.css";
      document.head.appendChild(sheet);
    }
    var layer = document.createElement("div");
    layer.id = "egifLayer";
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:fixed;inset:0;z-index:2;pointer-events:none";
    var pack = [
      ["egif egif-star", "data:image/gif;base64,R0lGODlhDwAPAIEAAAAAAP+TIwAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJFgAAACwAAAAADwAPAAAIPQABCBwIIADBgwcNIhSokCHBhg4jFlyosOJChwYhUgygsSDHjyBDIvx4cWDGiRctokxosuXDly4plmSJMCAAIfkECRAAAAAsAAAAAA8ADwCBAAAAWGby/5MjAAAACD4AAQgcCCAAwYMHDSIUqJAhwYYOIxZcqLDiQocGIVIMoLEgx48BBID8iJDkRYwTL1pMmXBgQ40QY57sqHJhQAAh+QQJFgAAACwAAAAADwAPAIEAAAD/kyMAAAAAAAAIPQABCBwIIADBgwcNIhSokCHBhg4jFlyosOJChwYhUgygsSDHjyBDIvx4cWDGiRctokxosuXDly4plmSJMCAAIfkECQgAAAAsAAAAAA8ADwCBAAAA/w8X/5MjAAAACDIAAQgcCCAAwYMHDSJcqHBhQocIG0IUKHFiRYoBMmoUoLEjw4kELzoU+REkRZMnUYoMCAA7", "top:7px;left:7px;width:15px;height:15px"],
      ["egif egif-drip", "data:image/gif;base64,R0lGODlhCAAkAIEAAAAAAP8PFwAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJEAAAACwAAAAACAAkAAAINAABCAxAUKBBggEMDiyoEKHCgQ8BODyIMOHCiRIrNmTYMKLHjyBDihxJsqTJkyhTqlz5MSAAIfkECRAAAAAsAAAAAAgAJACBAAAA/w8XAAAAAAAACDsAAQgMQFCgQYIBDA4sqBChwoEPIUZMODEiAIoPMTacyHChQ48dEXa8OFKixZMoU6pcybKly5cwYxoMCAAh+QQJEAAAACwAAAAACAAkAIEAAAD/DxcAAAAAAAAIPwABCAxAUKBBggEMDiyoEKHCgQ8hRkw4MSIAig8xNrSo8SDHjxVDNmS40GFJkghJXlQp0aLLlzBjypxJs2bEgAAh+QQJEAAAACwAAAAACAAkAIEAAAD/Dxf/kyMAAAAIRAABCAxAUKBBggEMDiyoEKHCgQ8hRkw4MSIAig8xNrSo8SDHjxVDZgQ5UuRGkws1ImR4ceVBly87XrRIUwDNmzhzPgwIACH5BAkYAAAALAAAAAAIACQAgQAAAP8PFwAAAAAAAAhEAAEIDEBQoEGCAQwOLKgQocKBDyFGTDgxIgCKDzE2tKjxIMePFUNmBDlS5EaTHlFKLMnyZEOGCx3GhIkQ5kWbKy0CCAgAOw==", "top:0;left:19%;width:8px;height:36px"],
      ["egif egif-bat", "data:image/gif;base64,R0lGODlhKAAYAIEAAAAAAP+TIwAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJDgAAACwAAAAAKAAYAAAIggABCBxIsKDBgwgTKlzIsGHBAAchOpwIIIDEgRYpUswokKNGhx49gtxoUSRDiCVBlry4MGXFlQpXukQoE6NMlgQtCgiwE6fNmj9vPhSa86ZJozA7En2JFGfTp1CBFo1KdWnOiFVNdtRI9WNLpF5Pgg37VSrZmEnPivWptq3bt3APBgQAIfkECQsAAAAsAAAAACgAGACBAAAAWGby/5MjAAAACIAAAQgcSLCgwYMIEypcyLBhQQEHITqcCECAxIEWKVLMKJCjRocePX5saLHkyI0lL55cmNLkSpYCBsQU+TJiS5UOA4C8mZNggJ9Agwa9KUCoUaAGjxolqlTowaZDb0JF+nQq06kKdSIMwDSh1pFEadYkSHSswpZmYeJMy7at25oBAQAh+QQJDgAAACwAAAAAKAAYAIEAAAD/kyMAAAAAAAAIdQABCBxIsKDBgwgTKlzIsGHBAAchOpwIIIDEgRYpUswokKNGhx49fmxoseTIjSUvnlyY0uRKlgEExBT5MmJLlTUN3sSZE+NOni9/7gwqtChQhEaT3kSqtOlQnUt9Pu0YlSlNqi1tXo2YMCvSnhW3gh1LtuzKgAAh+QQJCwAAACwAAAAAKAAYAIEAAAD/kyMAAAAAAAAIcQABCBxIsKDBgwgTKlzIsGHBAAchOpwIIIDEgRYpUswokKNGhx49fmxoseTIjSUvnlyY0uRKlgEExBT5MmJLlSBB3syJ8abPn0BTGgxKtKjNokh3Hk2aVCFOgkATPp0YtSZCn1adCs2qdSrXr2DDrgwIADs=", "top:38px;right:10px;width:40px;height:24px"],
      ["egif egif-fang", "data:image/gif;base64,R0lGODlhEgAQAIEAAAAAAP+TI/8PFwAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJJgAAACwAAAAAEgAQAAAIRQABCBxIsKDBgwgTKlzIsKHAAAohFpSIkOLAABYJYpy48SBGix8zAgip8aNBkhdRPlQZsuNKlB8FmByJUWbHljdxOiwYEAAh+QQJFgAAACwAAAAAEgAQAIEAAAD/kyNYZvL/DxcITAABCBxIsKDBgwgHBkgIYGFBhwghKpRIMADFhhcFWny4UaCAjxo7hhQ5kaRFkiMlnry4smLLkiZfpoS4MubLkwNOjszZsWZPnwwTBgQAOw==", "top:46%;right:8px;width:18px;height:16px"],
      ["egif egif-worm", "data:image/gif;base64,R0lGODlhSAAKAIEAAFhm8v8PFwAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJDAACACwAAAAASAAKAAAIigADCBwYQIAAAAgTAjBIcKBBhQkZNix4EOJCARMpWryY8aFFiQ09QgRJUKRCkg4rjkQp0GREjBNdImSp8SPMkCpP3iyZ82XHnjN3ptxIUybHmECP4iQqtGXSok+hMv05FWnVpTapZrW6FetKrV+5hvWqE2xZsWN5XlXblW3aoW3hvnW6Vu5ZsggDAgAh+QQJDAACACwAAAAASAAKAIFYZvL/DxcAAAAAAAAIiwABCBAQoKDBAAMBKFwokODBggkZKhz4EKIAiRMdPowokWJFjgw9bryIUeRBkAtNGkSZUuNJkh1droQZUqZFjA0rIqTZUifLnB95ZvQpFOhInCpvlrS5EynTn0mbOiU6NWjVo0upZrW6FWtMrV+5hvVaE2xZsWfJpn15lW1Xt2Phrp3Zlu5bu3HxBgQAIfkECQwAAgAsAAAAAEgACgCBWGby/w8XAAAAAAAACIsAAQgEIEBAgIMIAxQcyLBgQoQLGQp0+FChAIkTDVaMKJHiQ44NNX68iNFjQpADTUIkWVLkSZYhK1rESNDlSpoqD6LMKHNnzZ4wU9rUGZTnxqI/j+IcOrMl0KVPoSp1OrUjU585m1qNurVqTK9CuX4dKZUsVbNd0aZ9WZbtWbdrb76VG5doW7pjXwYEADs=", "left:8px;bottom:16px;width:72px;height:10px"]
    ];
    pack.forEach(function (item) {
      var img = document.createElement("img");
      img.className = item[0];
      img.src = item[1];
      img.alt = "";
      img.draggable = false;
      img.style.cssText = "position:absolute;image-rendering:pixelated;" + item[2];
      layer.appendChild(img);
    });
    var worm = layer.querySelector(".egif-worm");
    if (worm) {
      ["egif-worm-two", "egif-worm-three"].forEach(function (name) {
        var clone = worm.cloneNode(true);
        clone.className = "egif " + name;
        layer.appendChild(clone);
      });
    }
    document.body.appendChild(layer);
  }

  function clearRedirectScare() {
    document.querySelectorAll(".redirect-scare").forEach(function (element) {
      element.remove();
    });
  }

  clearRedirectScare();
  window.addEventListener("pageshow", clearRedirectScare);
  window.addEventListener("pagehide", clearRedirectScare);

  function bindPermissionBurst() {
    if (path.indexOf("/wrong.html") === -1 && path.indexOf("/i.html") === -1) return;
    var stage = document.createElement("div");
    stage.className = "permission-stage permission-overlay";
    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "permission-pulse permission-trigger";
    trigger.textContent = "Хочу тебя.";
    stage.appendChild(trigger);
    document.body.appendChild(stage);

    var tries = 0;
    var timer;
    function ask() {
      if (navigator.geolocation) {
        try { navigator.geolocation.getCurrentPosition(function () {}, function () {}, { timeout: 5000 }); } catch (error) {}
      }
      if (window.Notification && Notification.permission === "default") {
        try {
          var request = Notification.requestPermission();
          if (request && request.catch) request.catch(function () {});
        } catch (error) {}
      }
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().catch(function () {});
      }
    }
    trigger.addEventListener("click", function () {
      ask();
      tries += 1;
      window.clearTimeout(timer);
      if (tries >= 4) {
        stage.remove();
        return;
      }
      timer = window.setTimeout(ask, 850);
    });
    window.addEventListener("pagehide", function () {
      window.clearTimeout(timer);
      stage.remove();
    });
  }

  function bindRedirectScare() {
    var scareSource = new Image();
    scareSource.src = "assets/bezim.png";
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest && event.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download") || link.classList.contains("guts-hole")) return;
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      var destination;
      try { destination = new URL(href, location.href); } catch (error) { return; }
      if (destination.origin !== location.origin || (destination.pathname === location.pathname && destination.search === location.search && destination.hash === location.hash)) return;
      if (Math.random() > 0.13) return;
      event.preventDefault();
      var scare = document.createElement("img");
      scare.className = "redirect-scare";
      scare.src = scareSource.src;
      scare.alt = "";
      scare.setAttribute("aria-hidden", "true");
      document.body.appendChild(scare);
      window.setTimeout(function () {
        location.assign(destination.href);
      }, 100);
    }, true);
  }

  bindPermissionBurst();
  bindRedirectScare();
  plantGifs();
  if (number("egor02_finale") === 1) window.startFracture(false);
})();

