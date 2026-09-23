(function () {
  var VISIT_KEY = "egor02_visits";
  var SECRET_KEY = "egor02_secrets";
  var GUEST_KEY = "egor02_guestbook";
  var KEYS_KEY = "egor02_keys";
  var RIFT_KEY = "egor02_rift";
  var SITE_TITLE = "Vamprie?02";

  var PLANTED = [
    { id: "p1", name: "kitty666", text: "крутая страничка!! добавь кармиллу срочно", date: "04.08.2003" },
    { id: "p2", name: "drakula_fan", text: "арт огонь. откуда брал?? можно воровать? шучу", date: "12.11.2003" },
    { id: "p3", name: "лёха", text: "midi не работает лол поставь winamp", date: "03.03.2004" },
    { id: "p4", name: "EGOR02", text: "я потом доделаю. не трогайте файлы в cgi-bin", date: "04.08.2004" },
    {
      id: "p5",
      name: "",
      text: "",
      date: "",
      img: "guest/guest-aura.png",
      alt: ""
    }
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

  function readKeys() {
    try {
      var parsed = JSON.parse(localStorage.getItem(KEYS_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(function (x) { return typeof x === "string"; }) : [];
    } catch (e) {
      return [];
    }
  }

  function readRift() {
    var n = Number(localStorage.getItem(RIFT_KEY) || 0);
    return Number.isFinite(n) ? Math.max(0, Math.min(8, n)) : 0;
  }

  function gainKey(id) {
    var keys = readKeys();
    if (keys.indexOf(id) !== -1) return keys;
    keys.push(id);
    localStorage.setItem(KEYS_KEY, JSON.stringify(keys));
    var rift = Math.min(8, readRift() + 1);
    localStorage.setItem(RIFT_KEY, String(rift));
    document.documentElement.dataset.rift = String(rift);
    return keys;
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
    if (decay >= 4 || readRift() >= 6) return "001725";
    return String(Math.max(0, 41 + visits)).padStart(6, "0").slice(-6);
  }

  function norm(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/ё/g, "е");
  }

  function infectText(root) {
    var walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    var n = 0;
    while ((node = walk.nextNode())) {
      var parent = node.parentElement;
      if (!parent) continue;
      var tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "INPUT" || tag === "PRE") continue;
      if (parent.classList && parent.classList.contains("no-rot")) continue;
      n += 1;
      var t = String(node.nodeValue);
      if (n % 3 === 0) t = t.replace(/[А-Яа-яA-Za-z]{5,}/g, function (w) {
        return w + " ЕГОР02";
      });
      if (n % 4 === 0) t = t + " ЕГОР02 ЕГОР02";
      node.nodeValue = t;
    }
  }

  function rotText(root, rift) {
    if (rift < 2) return;
    var walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walk.nextNode())) {
      var parent = node.parentElement;
      if (!parent) continue;
      var tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "INPUT") continue;
      if (parent.classList && parent.classList.contains("no-rot")) continue;
      var t = node.nodeValue;
      if (rift >= 2) t = t.replace(/2004/g, "1725");
      if (rift >= 4) t = t.replace(/егор/gi, "ег\u00a0р");
      if (rift >= 6) t = t.replace(/вампир/gi, "вам пир");
      if (rift >= 7) t = t.replace(/страничка/g, "страни\u00adчка");
      node.nodeValue = t;
    }
  }

  var visits = bumpVisit();
  var decay = decayLevel(visits);
  var secrets = readSecrets();
  var keys = readKeys();
  var rift = readRift();

  document.documentElement.dataset.decay = String(decay);
  document.documentElement.dataset.rift = String(rift);
  document.title = SITE_TITLE;

  if (rift >= 5) {
    var mq = document.querySelector(".marquee-bar span");
    if (mq) mq.textContent = "WELCOME TO The Egor02 site!   ***   last ping 04.08.2004 03:17   ***   окно в кухне было открыто   ***   ";
  }
  if (rift >= 7) {
    document.title = " ";
  }

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
    if (found.length >= 3 || keys.length >= 4) dot.hidden = false;
  }
  revealFooter();

  var oldLink = document.getElementById("oldLink");
  if (oldLink && (decay >= 3 || rift >= 2)) oldLink.hidden = false;

  var wander = document.getElementById("fileWander");
  if (wander && (decay >= 2 || rift >= 1)) wander.hidden = false;

  var whisper = document.getElementById("whisper");
  if (whisper && (decay >= 3 || rift >= 2)) {
    whisper.hidden = false;
    if (rift >= 5) whisper.innerHTML = "кухня не в vault. <a href=\"kitchen.html\">печь</a>";
    else if (decay >= 4) whisper.textContent = "он ещё в отчёте";
    else whisper.textContent = "папка old сама не должна была открыться";
  }

  var kitchenHint = document.getElementById("kitchenHint");
  if (kitchenHint && rift >= 4) kitchenHint.hidden = false;

  var listing = document.getElementById("listing");
  if (listing) {
    var rows = [
      "index.html          04-Aug-2004  23:41",
      "guestbook.html      04-Aug-2004  21:02",
      "bats.html           12-Nov-2003  18:11",
      "vault.html          01-Jan-2004  00:00",
      "cgi-bin/                    <dir>",
      "old/                        <dir>"
    ];
    if (decay >= 3 || rift >= 2) rows.push("kisiljevo.htm       21-Jul-1725   1k");
    if (decay >= 4 || rift >= 3) rows.push("you.htm             ????-??-??     0");
    if (rift >= 1) rows.push("guest/befana.png    22-Sep-2026   ??");
    if (rift >= 4) rows.push("kitchen.htm         04-Aug-2004  03:17");
    if (rift >= 2) rows.push("fangs.htm           04-Aug-2004  ?");
    if (rift >= 3) rows.push("memories.htm        ????         ");
    if (rift >= 6) rows.push("cake.htm            ????         forbidden");
    if (rift >= 6) rows.push("couldjustbite.htm   ????         ");
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
        keys = gainKey("counter");
        location.href = "log.html";
      }
    });
  }

  var midiDead = document.getElementById("midiDead");
  if (midiDead) {
    var midiClicks = 0;
    midiDead.addEventListener("click", function () {
      midiClicks += 1;
      var msg = document.getElementById("midiMsg");
      if (midiClicks >= 3) {
        keys = gainKey("midi");
        msg.textContent = "файл на месте. играет вообще не то.";
      }
    });
  }

  document.querySelectorAll("[data-ring]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dir = btn.getAttribute("data-ring");
      var ring = ["guestbook.html", "vault.html", "bats.html", "old.html"];
      if (dir === "random") {
        var pool = decay >= 2 || rift >= 1 ? ring.concat(["kisiljevo.html"]) : ring.slice();
        if (rift >= 4) pool.push("kitchen.html");
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
      if (decay >= 2 || rift >= 2) extra.push({ id: "d2", name: "p.b.", text: "still fresh", date: "21.07.1725" });
      if (decay >= 4 || rift >= 3) extra.push({ id: "d4", name: "", text: "окно в кухне было открыто", date: "04.08.2004" });
      if (rift >= 5) extra.push({ id: "d5", name: "печь", text: "пароль не уголь. уголь - только бефана.", date: "??.??.????" });
      return extra;
    }
    function renderNotes() {
      var box = document.getElementById("guestExtra") || document.getElementById("guestNotes");
      if (!box) return;
      box.innerHTML = "";
      var all = decayNotes().concat(readNotes());
      all.forEach(function (n) {
        var row = document.createElement("div");
        row.className = "note-row";
        var b = document.createElement("b");
        var who = document.createElement("span");
        if (!n.name) who.className = "note-empty-ink";
        who.textContent = n.name || "???";
        b.appendChild(document.createTextNode(n.date + " · "));
        b.appendChild(who);
        row.appendChild(b);
        if (n.text) {
          var div = document.createElement("div");
          div.textContent = n.text;
          row.appendChild(div);
        }
        if (n.img) {
          var fig = document.createElement("figure");
          fig.className = "guest-fig";
          var im = document.createElement("img");
          im.src = n.img;
          im.alt = n.alt || "";
          im.className = "guest-pic";
          im.id = "befanaPic";
          fig.appendChild(im);
          if (n.alt) {
            var cap = document.createElement("figcaption");
            cap.className = "guest-cap";
            cap.textContent = "подпись: " + n.alt;
            fig.appendChild(cap);
          }
          row.appendChild(fig);
        }
        box.appendChild(row);
      });
      var pic = document.getElementById("befanaPic");
      if (pic) {
        var taps = 0;
        pic.addEventListener("click", function () {
          taps += 1;
          if (taps >= 3) {
            keys = gainKey("befana");
            var cap = pic.parentElement.querySelector("figcaption");
            if (cap) cap.textContent = "бефана уже был. печь: cgi-bin/oven.cgi";
          }
        });
      }
    }
    renderNotes();
    guestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (guestForm.elements.name.value || "").slice(0, 32);
      var text = (guestForm.elements.text.value || "").slice(0, 180);
      var flash = document.getElementById("guestFlash");
      var raw = norm(text);
      if (!text.trim()) {
        flash.textContent = "пустую запись не приклею";
        return;
      }
      if (isPetarName(name)) {
        secrets = writeSecret("kisiljevo");
        keys = gainKey("petar");
        flash.textContent = "запись приклеена. теперь посмотри не в ту папку.";
      } else if (raw === "уголь" || raw === "уголь.") {
        keys = gainKey("coal");
        flash.textContent = "уголь принят, но торт из него не испечёшь. ищи печь.";
      } else if (raw === "0408" || raw === "04.08" || raw === "04.08.2004") {
        keys = gainKey("date");
        flash.textContent = "день подходит. год не нужен. печь это знает.";
      } else if (raw === "befana" || raw === "бефана") {
        keys = gainKey("befana");
        flash.textContent = "он приносит уголь. пароль длиннее одного слова.";
      } else if (raw === "егорвампирокурки") {
        keys = gainKey("kurki");
        localStorage.setItem(RIFT_KEY, String(Math.max(readRift(), 7)));
        flash.textContent = "печь узнала пароль. кухня открыта.";
      } else {
        flash.textContent = "спасибо. если там вирус - сам виноват.";
      }
      writeNote({
        id: Date.now() + "-" + Math.random().toString(16).slice(2, 6),
        name: name.trim() || "аноним",
        text: text.trim(),
        date: formatToday()
      });
      guestForm.reset();
      renderNotes();
    });
  }

  if (location.pathname.indexOf("kisiljevo") !== -1) {
    secrets = writeSecret("kisiljevo");
    keys = gainKey("kisil");
    if (decay >= 3 || rift >= 2) {
      var again = document.getElementById("again");
      if (again) again.hidden = false;
    }
    if (decay >= 4 || rift >= 3) {
      var unf = document.getElementById("unfinished");
      var ping = document.getElementById("lastPing");
      if (unf) unf.hidden = true;
      if (ping) ping.hidden = false;
    }
    var fromForm = document.getElementById("frombaldForm");
    if (fromForm) {
      fromForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = norm(fromForm.elements.who.value);
        var out = document.getElementById("frombaldFlash");
        if (v === "frombald" || v === "фромбальд" || v === "frombald.") {
          keys = gainKey("frombald");
          out.textContent = "чиновника записал. 21.07.1725. для печи это не пароль, зато год уже есть в счётчике.";
        } else {
          out.textContent = "не он. ищи фамилию австрийца в рапорте.";
        }
      });
    }
  }

  if (location.pathname.indexOf("cgi-bin") !== -1) {
    secrets = writeSecret("cgi");
    keys = gainKey("cgi");
    var reset = document.getElementById("resetCounter");
    if (reset) {
      reset.addEventListener("click", function () {
        localStorage.removeItem(VISIT_KEY);
        localStorage.removeItem(SECRET_KEY);
        localStorage.removeItem(KEYS_KEY);
        localStorage.removeItem(RIFT_KEY);
        location.href = "index.html";
      });
    }
  }

  if (location.pathname.indexOf("old.html") !== -1) {
    secrets = writeSecret("old");
    keys = gainKey("old");
  }

  if (location.pathname.indexOf("log.html") !== -1) {
    secrets = writeSecret("counter");
    var log = document.getElementById("accessLog");
    if (log) {
      log.textContent =
        "127.0.0.1 - - [04/Aug/2003:21:02:11] \"GET /index.html\"\n" +
        "10.0.0.6 - - [12/Nov/2003:18:11:40] \"GET /bats.html\"\n" +
        "172.16.0.2 - - [01/Jan/2004:00:00:01] \"GET /vault.html\"\n" +
        "127.0.0.1 - - [04/Aug/2004:03:17:02] \"PUT /kisiljevo.htm\"\n" +
        "0.0.0.0 - - [21/Jul/1725:00:00:00] \"GET /kisiljevo.htm\"\n" +
        "127.0.0.1 - - [04/Aug/2004:03:18:44] \"GET /oven.cgi?hint=date\" 403\n" +
        "22.09.2026 - - [now] \"POST /guestbook.html\" To4hnoNeDroft\n" +
        "127.0.0.1 - - [now] visits=" + visits + " rift=" + rift + " keys=" + (keys.join(",") || "none");
    }
  }

  if (location.pathname.indexOf("you.html") !== -1) {
    secrets = writeSecret("you");
    var found = secrets.filter(function (s) { return s !== "you"; });
    var root = document.getElementById("youRoot");
    if (found.length < 3 && keys.length < 4) {
      root.innerHTML = "<p>ты рано.</p><p><a href=\"index.html\">index.html</a></p>";
    } else {
      keys = gainKey("you");
      root.innerHTML =
        "<h1>ты сломал счётчик</h1><p>и гостевую</p><p>и папку old</p><p>егора нет с 04.08.2004</p><p>дерево было справа.</p><p>торт на кухне. печь просит два слова через дефис.</p><p><a href=\"kitchen.html\">кухня</a> · <a href=\"index.html\">.</a></p>";
    }
  }

  if (location.pathname.indexOf("bats") !== -1) {
    var missing = document.querySelector("img[src=\"missing-bat.gif\"]");
    if (!missing) missing = document.querySelector(".on-tile img");
    if (missing) {
      var bt = 0;
      missing.addEventListener("click", function () {
        bt += 1;
        if (bt >= 3) {
          keys = gainKey("bats");
          missing.alt = "три свечи. дата без года.";
          var slot = document.getElementById("batSlotNote");
          if (slot) slot.hidden = false;
        }
      });
    }
  }

  var ovenForm = document.getElementById("ovenForm");
  if (ovenForm) {
    ovenForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = norm(ovenForm.elements.pass.value);
      var out = document.getElementById("ovenFlash");
      if (v === "уголь") {
        keys = gainKey("coal");
        out.textContent = "уголь лежит в ящике. торт пекли не из него.";
      } else if (v === "0408" || v === "04.08") {
        keys = gainKey("date");
        out.textContent = "дата подходит. теперь не хватает первого слова.";
      } else if (v === "1725") {
        keys = gainKey("year");
        out.textContent = "это число из счётчика. печь ждёт другое.";
      } else if (v === "frombald" || v === "фромбальд") {
        keys = gainKey("frombald");
        out.textContent = "чиновник составлял рапорт, а не пёк торт.";
      } else if (v === "befana" || v === "бефана") {
        keys = gainKey("befana");
        out.textContent = "первое слово есть. второе - дата без года и точек.";
      } else if (v === "befana-0408" || v === "бефана-0408") {
        keys = gainKey("oven");
        localStorage.setItem(RIFT_KEY, "7");
        location.href = "kitchen.html";
      } else if (v === "егорвампирокурки" || v === "egrrrtl3nie") {
        keys = gainKey("kurki");
        keys = gainKey("oven");
        localStorage.setItem(RIFT_KEY, "7");
        location.href = "kitchen.html";
      } else {
        out.textContent = "403 forbidden";
      }
    });
  }

  if (location.pathname.indexOf("kitchen") !== -1) {
    var gate = document.getElementById("kitchenGate");
    var room = document.getElementById("kitchenRoom");
    if (keys.indexOf("oven") !== -1 || rift >= 7) {
      if (gate) gate.hidden = true;
      if (room) room.hidden = false;
      keys = gainKey("kitchen");
    } else if (gate && room) {
      gate.hidden = false;
      room.hidden = true;
    }
  }

  if (location.pathname.indexOf("cake") !== -1) {
    if (keys.indexOf("oven") === -1 && rift < 7) {
      location.href = "kitchen.html";
    } else {
      localStorage.setItem(RIFT_KEY, "8");
      document.documentElement.dataset.rift = "8";
      keys = gainKey("cake");
    }
  }

  if (location.pathname.indexOf("commits") !== -1) {
    keys = gainKey("commit");
    var commitForm = document.getElementById("commitForm");
    if (commitForm) {
      commitForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = norm(commitForm.elements.pass.value);
        var out = document.getElementById("commitFlash");
        if (v === "егорвампирокурки" || v === "egrrrtl3nie") {
          keys = gainKey("kurki");
          keys = gainKey("oven");
          localStorage.setItem(RIFT_KEY, String(Math.max(readRift(), 7)));
          location.href = "kitchen.html";
        } else if (v === "befana-0408" || v === "бефана-0408") {
          keys = gainKey("oven");
          localStorage.setItem(RIFT_KEY, "7");
          location.href = "kitchen.html";
        } else {
          out.textContent = "нет. байты складываются не в это.";
        }
      });
    }
  }

  if (location.pathname.indexOf("couldjustbite") !== -1) {
    keys = gainKey("smile");
    infectText(document.body);
  }

  if (location.pathname.indexOf("whoareyouhidingfrom") !== -1) {
    keys = gainKey("hide");
    infectText(document.body);
    window.alert("nosey nosey");
  }

  if (location.pathname.indexOf("memories") !== -1) {
    keys = gainKey("memory");
  }

  if (location.pathname.indexOf("fangs") !== -1) {
    keys = gainKey("fangs");
  }

  if (location.pathname.indexOf("teeth") !== -1) {
    keys = gainKey("teeth");
  }

  document.querySelectorAll(".voice-dead").forEach(function (el) {
    var taps = 0;
    el.addEventListener("click", function () {
      taps += 1;
      el.textContent = taps === 1 ? "plugin missing" : "файл на месте. играет вообще не то.";
      if (taps >= 2) keys = gainKey("voice");
    });
  });

  rotText(document.body, readRift());
  revealFooter();

})();
