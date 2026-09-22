(function () {
  var VISIT_KEY = "egor02_visits";
  var SECRET_KEY = "egor02_secrets";
  var GUEST_KEY = "egor02_guestbook";

  var SITE_TITLE = "Vamprie?02";

  var PLANTED = [
    { id: "p1", name: "kitty666", text: "крутая страничка!! добавь кармиллу срочно", date: "04.08.2003" },
    { id: "p2", name: "drakula_fan", text: "арт огонь. откуда брал?? можно воровать? шучу", date: "12.11.2003" },
    { id: "p3", name: "лёха", text: "midi не работает лол поставь winamp", date: "03.03.2004" },
    { id: "p4", name: "EGOR02", text: "я потом доделаю. не трогайте файлы в cgi-bin", date: "04.08.2004" },
  ];

  function decayLevel(visits) {
    if (visits <= 1) return 0;
    if (visits === 2) return 1;
    if (visits <= 4) return 2;
    if (visits <= 7) return 3;
    return 4;
  }

  function readVisits() {
    var n = Number(localStorage.getItem(VISIT_KEY) || 0);
    return Number.isFinite(n) ? n : 0;
  }

  function bumpVisit() {
    var next = readVisits() + 1;
    localStorage.setItem(VISIT_KEY, String(next));
    return next;
  }

  function readSecrets() {
    try {
      var parsed = JSON.parse(localStorage.getItem(SECRET_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(function (x) { return typeof x === "string"; }) : [];
    } catch (e) {
      return [];
    }
  }

  function writeSecret(id) {
    var current = readSecrets();
    if (current.indexOf(id) !== -1) return current;
    current.push(id);
    localStorage.setItem(SECRET_KEY, JSON.stringify(current));
    return current;
  }

  function readNotes() {
    try {
      var parsed = JSON.parse(localStorage.getItem(GUEST_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeNote(note) {
    var next = readNotes();
    next.push(note);
    localStorage.setItem(GUEST_KEY, JSON.stringify(next));
    return next;
  }

  function isPetarName(name) {
    return /петр|пётр|petar|peter|blago|благо/i.test(name);
  }

  function formatToday() {
    var d = new Date();
    var dd = String(d.getDate()).padStart(2, "0");
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    return dd + "." + mm + "." + d.getFullYear();
  }

  function counterDigits(visits, decay) {
    if (decay >= 4) return "001725";
    return String(Math.max(0, 41 + visits)).padStart(6, "0").slice(-6);
  }

  var visits = bumpVisit();
  var decay = decayLevel(visits);
  var secrets = readSecrets();

  document.documentElement.dataset.decay = String(decay);
  document.title = SITE_TITLE;

  document.querySelectorAll("[data-secret]").forEach(function (el) {
    el.addEventListener("click", function () {
      secrets = writeSecret(el.getAttribute("data-secret"));
      revealFooter();
    });
  });

  function revealFooter() {
    var dot = document.getElementById("footDot");
    if (!dot) return;
    var found = secrets.filter(function (s) { return s !== "you"; });
    if (found.length >= 3) dot.hidden = false;
  }
  revealFooter();

  var oldLink = document.getElementById("oldLink");
  if (oldLink && decay >= 3) oldLink.hidden = false;

  var wander = document.getElementById("fileWander");
  if (wander && decay >= 2) wander.hidden = false;

  var whisper = document.getElementById("whisper");
  if (whisper && decay >= 3) {
    whisper.hidden = false;
    whisper.textContent = decay >= 4 ? "он ещё в отчёте" : "папка old не должна открываться";
  }

  var listing = document.getElementById("listing");
  if (listing) {
    var rows = [
      "index.html          04-Aug-2004  23:41",
      "guestbook.html      04-Aug-2004  21:02",
      "bats.html           12-Nov-2003  18:11",
      "vault.html          01-Jan-2004  00:00",
      "cgi-bin/                    <dir>",
      "old/                        <dir>",
    ];
    if (decay >= 3) rows.push("kisiljevo.htm       21-Jul-1725   1k");
    if (decay >= 4) rows.push("you.htm             ????-??-??     0");
    listing.textContent = "Index of /vampires\n\n" + rows.join("\n");
  }

  var leds = document.getElementById("leds");
  if (leds) {
    var clicks = 0;
    counterDigits(visits, decay).split("").forEach(function (d) {
      var span = document.createElement("span");
      span.className = "led";
      span.textContent = d;
      leds.appendChild(span);
    });
    document.getElementById("hitCounter").addEventListener("click", function () {
      clicks += 1;
      if (clicks >= 6) {
        secrets = writeSecret("counter");
        location.href = "log.html";
      }
    });
  }

  var midiDead = document.getElementById("midiDead");
  if (midiDead) {
    midiDead.addEventListener("click", function () {
      var msg = document.getElementById("midiMsg");
      if (msg) msg.textContent = decay >= 3 ? "файл есть. трек не тот." : "Your browser does not support the audio element.";
    });
  }

  document.querySelectorAll("[data-ring]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dir = btn.getAttribute("data-ring");
      var ring = ["guestbook.html", "vault.html", "bats.html", "old.html"];
      if (dir === "random") {
        var pool = decay >= 2 ? ring.concat(["kisiljevo.html"]) : ring.slice();
        var pick = pool[Math.floor(Math.random() * pool.length)];
        if (pick === "kisiljevo.html") secrets = writeSecret("kisiljevo");
        if (pick === "old.html") secrets = writeSecret("old");
        location.href = pick;
        return;
      }
      location.href = dir === "next" ? ring[1] : ring[ring.length - 1];
    });
  });

  document.querySelectorAll(".myth-on-tile").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = document.getElementById("mythAnswer");
      if (!box) return;
      box.hidden = false;
      box.textContent = btn.getAttribute("data-answer") || "";
    });
  });

  var guestForm = document.getElementById("guestForm");
  if (guestForm) {
    function decayNotes() {
      var extra = [];
      if (decay >= 2) extra.push({ id: "d2", name: "p.b.", text: "still fresh", date: "21.07.1725" });
      if (decay >= 4) extra.push({ id: "d4", name: "", text: "окно в кухне было открыто", date: "04.08.2004" });
      return extra;
    }
    function renderNotes() {
      var all = decayNotes().concat(readNotes());
      var box = document.getElementById("guestExtra") || document.getElementById("guestNotes");
      if (!box) return;
      box.innerHTML = "";
      all.forEach(function (n) {
        var row = document.createElement("div");
        row.className = "note-row";
        var b = document.createElement("b");
        var who = document.createElement("span");
        if (!n.name) who.className = "note-empty-ink";
        who.textContent = n.name || "???";
        b.appendChild(document.createTextNode(n.date + " · "));
        b.appendChild(who);
        var div = document.createElement("div");
        div.textContent = n.text;
        row.appendChild(b);
        row.appendChild(div);
        box.appendChild(row);
      });
    }
    renderNotes();
    guestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (guestForm.elements.name.value || "").slice(0, 32);
      var text = (guestForm.elements.text.value || "").slice(0, 180);
      var flash = document.getElementById("guestFlash");
      if (!text.trim()) {
        flash.textContent = "пустое не приму";
        return;
      }
      if (isPetarName(name)) {
        secrets = writeSecret("kisiljevo");
        flash.textContent = "запись принята. смотри не ту папку.";
      } else {
        flash.textContent = "спасибо. если с вирусом — сам виноват.";
      }
      writeNote({
        id: Date.now() + "-" + Math.random().toString(16).slice(2, 6),
        name: name.trim() || "аноним",
        text: text.trim(),
        date: formatToday(),
      });
      guestForm.reset();
      renderNotes();
    });
  }

  if (location.pathname.indexOf("kisiljevo") !== -1) {
    secrets = writeSecret("kisiljevo");
    if (decay >= 3) document.getElementById("again").hidden = false;
    if (decay >= 4) {
      document.getElementById("unfinished").hidden = true;
      document.getElementById("lastPing").hidden = false;
    }
  }

  if (location.pathname.indexOf("cgi-bin") !== -1) {
    secrets = writeSecret("cgi");
    document.getElementById("resetCounter").addEventListener("click", function () {
      localStorage.removeItem(VISIT_KEY);
      localStorage.removeItem(SECRET_KEY);
      location.href = "index.html";
    });
  }

  if (location.pathname.indexOf("old.html") !== -1) {
    secrets = writeSecret("old");
  }

  if (location.pathname.indexOf("log.html") !== -1) {
    secrets = writeSecret("counter");
    document.getElementById("accessLog").textContent =
      '127.0.0.1 - - [04/Aug/2003:21:02:11] "GET /index.html"\n' +
      '10.0.0.6 - - [12/Nov/2003:18:11:40] "GET /bats.html"\n' +
      '172.16.0.2 - - [01/Jan/2004:00:00:01] "GET /vault.html"\n' +
      '127.0.0.1 - - [04/Aug/2004:03:17:02] "PUT /kisiljevo.htm"\n' +
      '0.0.0.0 - - [21/Jul/1725:00:00:00] "GET /kisiljevo.htm"\n' +
      "127.0.0.1 - - [now] visits=" + visits + " secrets=" + (secrets.join(",") || "none");
  }

  if (location.pathname.indexOf("you.html") !== -1) {
    secrets = writeSecret("you");
    var found = secrets.filter(function (s) { return s !== "you"; });
    var root = document.getElementById("youRoot");
    if (found.length < 3) {
      root.innerHTML = "<p>ты рано.</p><p><a href=\"index.html\">index.html</a></p>";
    } else {
      root.innerHTML =
        " <h1>ты сломал счётчик</h1><p>и гостевую</p><p>и папку old</p><p>егора нет с 04.08.2004</p><p>дерево было справа.</p><p><a href=\"index.html\">.</a></p>";
    }
  }

  revealFooter();
})();
