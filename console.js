(function () {
  var RIFT_KEY = "egor02_rift";

  function setRift(value) {
    var n = Number(value);
    if (!Number.isFinite(n)) return;
    n = Math.max(0, Math.min(9, Math.floor(n)));
    try {
      localStorage.setItem(RIFT_KEY, String(n));
    } catch (e) {}
    document.documentElement.dataset.rift = String(n);
    console.log("rift=" + n);
  }

  var E = {
    help: function () {
      console.log("%cЕгор02 консоль", "font-size:16px;color:#c994a0");
      console.log("egor.bite()      — укус");
      console.log("egor.blood()     — кровь");
      console.log("egor.kisiljevo() — 1725");
      console.log("egor.teeth()     — два байта");
      console.log("egor.rift(n)     — установить rift 0–9");
    },
    bite: function () {
      console.log("%cты чувствуешь это?", "color:#8a1020;font-size:18px");
      setRift(9);
      if (document.body) document.body.style.animation = "shake 0.3s infinite";
    },
    blood: function () {
      if (document.body) {
        document.body.style.background = "#1a0008";
        document.body.style.color = "#c994a0";
      }
      console.log("%cкровь пошла", "color:#c994a0;font-size:14px");
    },
    kisiljevo: function () {
      console.log("Петар Благоевич. 1725.");
      console.log("рапорт увезли в Вену.");
      console.log("тело не тлеет.");
      console.log("ногти растут.");
      location.href = "kisiljevo.html";
    },
    teeth: function () {
      console.log("11010000 10010101 = Е");
      console.log("11010000 10010011 = Г");
      location.href = "teeth.html";
    },
    rift: setRift
  };

  window.egor = E;
  console.log("%cнапиши egor.help()", "color:#6a7eb8");
})();

