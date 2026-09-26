(function () {
  var root = document.getElementById("permRoot");
  if (!root) return;

  function show(message, cls) {
    var result = document.getElementById("permResult");
    if (!result) return;
    result.textContent = message;
    result.className = "perm-result " + (cls || "");
  }

  function raiseRift(level) {
    try {
      var current = Number(localStorage.getItem("egor02_rift") || 0);
      var next = Math.max(current, level);
      localStorage.setItem("egor02_rift", String(Math.min(9, next)));
      document.documentElement.dataset.rift = String(Math.min(9, next));
    } catch (e) {}
  }

  function fakeRequest(label, level) {
    return function () {
      raiseRift(level);
      show("локальный запрос «" + label + "». устройство не трогалось, данные никуда не отправлены.", "ok");
    };
  }

  document.getElementById("askGeo").addEventListener("click", fakeRequest("геолокация", 1));
  document.getElementById("askNotify").addEventListener("click", fakeRequest("уведомления", 2));
  document.getElementById("askClip").addEventListener("click", function () {
    show("буфер не прочитан. сайт только делает вид.", "fail");
  });
})();

