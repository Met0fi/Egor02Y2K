(function () {
  var VISIT_KEY = "egor02_visits";
  var SECRET_KEY = "egor02_secrets";
  var KEYS_KEY = "egor02_keys";
  var RIFT_KEY = "egor02_rift";

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

  if (location.pathname.indexOf("carmilla") !== -1) {
    try {
      var keys = JSON.parse(localStorage.getItem(KEYS_KEY) || "[]");
      if (keys.indexOf("carmilla") === -1) {
        keys.push("carmilla");
        localStorage.setItem(KEYS_KEY, JSON.stringify(keys));
        var rift = Math.min(8, Number(localStorage.getItem(RIFT_KEY) || 0) + 1);
        localStorage.setItem(RIFT_KEY, String(rift));
        document.documentElement.dataset.rift = String(rift);
      }
    } catch (e) {}
  }

  if (location.pathname.indexOf("glaza") !== -1) {
    try {
      var keys2 = JSON.parse(localStorage.getItem(KEYS_KEY) || "[]");
      if (keys2.indexOf("smile") === -1) {
        keys2.push("smile");
        localStorage.setItem(KEYS_KEY, JSON.stringify(keys2));
      }
    } catch (e) {}
  }

  document.querySelectorAll(".guest-cap").forEach(function (cap) {
    if (/cgi-bin/.test(cap.textContent)) {
      cap.textContent = "бефана уже был. печь лежит отдельно. oven.html";
    }
  });
})();
