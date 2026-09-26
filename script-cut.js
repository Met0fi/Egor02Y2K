(function () {
  var reset = document.getElementById("resetCounter");
  if (!reset || reset.dataset.cut) return;
  reset.dataset.cut = "1";
  reset.addEventListener("click", function () {
    ["egor02_visits", "egor02_secrets", "egor02_keys", "egor02_rift", "egor02_guestbook", "egor02_ledger_pages"].forEach(function (key) {
      localStorage.removeItem(key);
    });
    location.href = "index.html";
  });
})();

