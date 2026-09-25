(function () {
  var VISIT_KEY = "egor02_visits";
  var SECRET_KEY = "egor02_secrets";
  var KEYS_KEY = "egor02_keys";
  var RIFT_KEY = "egor02_rift";

  document.querySelectorAll('a[href="vault.html"]').forEach(function (a) {
    a.remove();
  });

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
