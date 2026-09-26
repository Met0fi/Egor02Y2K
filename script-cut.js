(function () {
  var reset = document.getElementById("resetCounter");

  function scrub() {
    document.querySelectorAll(".note-row").forEach(function (row) {
      var text = row.textContent || "";
      if (/окно в кухне было открыто|пароль не уголь|still fresh/i.test(text)) row.remove();
    });
    var marquee = document.querySelector(".marquee-bar span");
    if (marquee && /окно в кухне/.test(marquee.textContent || "")) {
      marquee.textContent = "WELCOME TO The Egor02 site!   ***   WELCOME TO The Egor02 site!   ***   ";
    }
  }

  scrub();
  window.setTimeout(scrub, 50);
  window.setTimeout(scrub, 400);

  if (!reset || reset.dataset.cut) return;
  reset.dataset.cut = "1";
  reset.addEventListener("click", function () {
    ["egor02_visits", "egor02_secrets", "egor02_keys", "egor02_rift", "egor02_guestbook", "egor02_ledger_pages"].forEach(function (key) {
      localStorage.removeItem(key);
    });
    location.href = "index.html";
  });
})();

