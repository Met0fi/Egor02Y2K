(function () {
  var E = {
    help: function () {
      console.log("%cЕгор02 консоль", "font-size:16px;color:#c994a0");
      console.log("egor.bite()      — укус");
      console.log("egor.blood()     — кровь");
      console.log("egor.kisiljevo() — 1725");
      console.log("egor.teeth()     — два байта");
      console.log("egor.rift(n)     — установить rift");
    },
    bite: function () {
      console.log("%cты чувствуешь это?", "color:#8a1020;font-size:18px");
      document.documentElement.setAttribute("data-rift", "9");
      document.body.style.animation = "shake 0.3s infinite";
    },
    blood: function () {
      document.body.style.background = "#1a0008";
      document.body.style.color = "#c994a0";
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
    rift: function (n) {
      n = parseInt(n, 10);
      if (isNaN(n) || n < 0 || n > 9) return;
      document.documentElement.setAttribute("data-rift", String(n));
      console.log("rift=" + n);
    }
  };
  window.egor = E;
  console.log("%cнапиши egor.help()", "color:#6a7eb8");
})();
