(function () {
  var VISIT_KEY = "egor02_visits";
  var SECRET_KEY = "egor02_secrets";
  var KEYS_KEY = "egor02_keys";
  var RIFT_KEY = "egor02_rift";

  document.querySelectorAll('a[href="vault.html"]').forEach(function (a) {
    a.remove();
  });

  function scrub() {
    var extra = document.getElementById("guestExtra");
    if (extra) extra.innerHTML = "";
    document.querySelectorAll(".note-row").forEach(function (row) {
      var t = row.textContent || "";
      if (t.indexOf("окно в кухне было открыто") !== -1) row.remove();
      else if (t.indexOf("пароль не уголь") !== -1) row.remove();
    });
    var mq = document.querySelector(".marquee-bar span");
    if (mq && /окно в кухне/.test(mq.textContent || "")) {
      mq.textContent = "WELCOME TO The Egor02 site!   ***   WELCOME TO The Egor02 site!   ***   WELCOME TO The Egor02 site!   ***   ";
    }
    var whisper = document.getElementById("whisper");
    if (whisper) {
      whisper.hidden = true;
      whisper.textContent = "";
    }
    var hint = document.getElementById("kitchenHint");
    if (hint) hint.hidden = true;
  }
  scrub();
  setTimeout(scrub, 50);
  setTimeout(scrub, 400);

  var reset = document.getElementById("resetCounter");
  if (reset && !reset.dataset.cut) {
    reset.dataset.cut = "1";
    reset.addEventListener("click", function () {
      localStorage.removeItem(VISIT_KEY);
      localStorage.removeItem(SECRET_KEY);
      localStorage.removeItem(KEYS_KEY);
      localStorage.removeItem(RIFT_KEY);
      location.href = "index.html";
    });
  }
})();
