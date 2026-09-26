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
    return String(value || "").toLowerCase().trim().replace(/ё/g, "е").replace(/[\s.]/g, "");
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
    rift = riftUp(Math.min(8, keys.length + (keys.indexOf("cake") !== -1 ? 1 : 0)));
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

  var reset = document.getElementById("resetCounter");
  if (reset) reset.addEventListener("click", function () {
    [VISITS, SECRETS, KEYS, RIFT, NOTES].forEach(function (key) { try { localStorage.removeItem(key); } catch (error) {} });
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

  function noiseSound() {
    try {
      var AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      var audio = new AudioCtor();
      var length = Math.floor(audio.sampleRate * 2.2);
      var buffer = audio.createBuffer(1, length, audio.sampleRate);
      var data = buffer.getChannelData(0);
      var last = 0;
      for (var i = 0; i < length; i += 1) {
        var t = i / audio.sampleRate;
        var white = Math.random() * 2 - 1;
        last = last * 0.985 + white * 0.015;
        var pulse = Math.sin(t * 36) * 0.14 + Math.sin(t * 5.5) * 0.2;
        data[i] = (white - last * 0.7 + pulse) * Math.min(1, t * 16) * Math.max(0, 1 - t / 2.2);
      }
      var source = audio.createBufferSource();
      var filter = audio.createBiquadFilter();
      var gainNode = audio.createGain();
      source.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.value = 480;
      filter.Q.value = 1.7;
      gainNode.gain.value = 0.75;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audio.destination);
      source.start();
    } catch (error) {}
  }

  function fakePermission() {
    var old = document.getElementById("fakePermission");
    if (old) old.remove();
    var overlay = document.createElement("div");
    overlay.id = "fakePermission";
    overlay.className = "fake-permission";
    overlay.innerHTML = "<div class=\"fake-permission__box\" role=\"dialog\" aria-label=\"Системное разрешение\"><strong>Разрешение на камеру</strong><p>страница пытается увидеть, кто остался.</p><div><button type=\"button\" data-answer=\"yes\">разрешить</button><button type=\"button\" data-answer=\"no\">запретить</button></div><small>это визуальная часть финала, доступ к устройству не запрашивается.</small></div>";
    document.body.appendChild(overlay);
    overlay.querySelectorAll("button").forEach(function (button) {
      button.addEventListener("click", function () { overlay.remove(); });
    });
  }

  function finale() {
    if (document.body.dataset.finale === "1") return;
    document.body.dataset.finale = "1";
    gain("cake");
    riftUp(8);
    noiseSound();
    document.body.classList.add("is-collapsing");
    var canvas = document.createElement("canvas");
    canvas.id = "finaleNoise";
    document.body.appendChild(canvas);
    var context = canvas.getContext("2d");
    var frame = 0;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function draw() {
      var image = context.createImageData(canvas.width, canvas.height);
      var data = image.data;
      for (var i = 0; i < data.length; i += 4) {
        var value = Math.random() > 0.53 ? 255 : 0;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 180;
      }
      context.putImageData(image, 0, 0);
      frame += 1;
      if (frame < 75) requestAnimationFrame(draw);
      else canvas.classList.add("steady");
    }
    resize();
    window.addEventListener("resize", resize);
    draw();
    setTimeout(fakePermission, 2200);
    window.setInterval(fakePermission, 5000);
  }

  window.EgorFinale = { start: finale };
  var cake = document.getElementById("cakePic");
  if (cake && root.dataset.page === "cake") cake.addEventListener("click", finale);
  if (root.dataset.page === "cake" && keys.indexOf("oven") === -1 && rift < 7) location.href = "kitchen.html";
})();


