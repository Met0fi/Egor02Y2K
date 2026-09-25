(function () {
  var VISIT_KEY = "egor02_visits";
  var SECRET_KEY = "egor02_secrets";
  var KEYS_KEY = "egor02_keys";
  var RIFT_KEY = "egor02_rift";

  document.querySelectorAll('a[href="vault.html"]').forEach(function (a) {
    a.remove();
  });

  var extra = document.getElementById("guestExtra");
  if (extra) extra.textContent = "";
  function scrubNotes() {
    document.querySelectorAll(".note-row").forEach(function (row) {
      var t = row.textContent || "";
      if (/still fresh/i.test(t) || t.indexOf("p.b.") !== -1) row.remove();
    });
  }
  scrubNotes();
  setTimeout(scrubNotes, 60);
  setTimeout(scrubNotes, 400);

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

  document.querySelectorAll(".guest-cap").forEach(function (cap) {
    if (/cgi-bin/.test(cap.textContent)) {
      cap.textContent = "бефана уже был. печь лежит отдельно. oven.html";
    }
  });
})();
