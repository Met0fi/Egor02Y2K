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
      name: "To4hnoNeDroft",
      text: "",
      date: "22.09.2026",
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
