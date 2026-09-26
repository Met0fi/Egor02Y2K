(function () {
  var root = document.getElementById("permRoot");
  if (!root) return;

  function show(msg, cls) {
    var el = document.getElementById("permResult");
    if (el) {
      el.textContent = msg;
      el.className = "perm-result " + (cls || "");
    }
  }

  function setRift(n) {
    try {
      document.documentElement.setAttribute("data-rift", String(n));
      localStorage.setItem("egor02_rift", String(n));
    } catch (e) {}
  }

  document.getElementById("askGeo").addEventListener("click", function () {
    if (!navigator.geolocation) {
      show("геолокация недоступна. браузер врёт.", "fail");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude.toFixed(4);
        var lon = pos.coords.longitude.toFixed(4);
        show("ты здесь: " + lat + ", " + lon + ". егор уже знает.", "ok");
        try {
          localStorage.setItem("egor02_geo", lat + "," + lon);
        } catch (e) {}
        setRift(1);
      },
      function () {
        show("не дал. ладно. найдём другим способом.", "fail");
      }
    );
  });

  document.getElementById("askNotify").addEventListener("click", function () {
    if (!("Notification" in window)) {
      show("уведомления не поддерживаются.", "fail");
      return;
    }
    Notification.requestPermission().then(function (p) {
      if (p === "granted") {
        show("разрешил. жди сообщения.", "ok");
        setRift(2);
        setTimeout(function () {
          try {
            new Notification("Егор02", {
              body: "ты всё ещё здесь?",
              icon: "favicon.svg"
            });
          } catch (e) {}
        }, 8000);
      } else {
        show("отказался. но мы уже внутри.", "fail");
      }
    });
  });

  document.getElementById("askClip").addEventListener("click", function () {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      show("буфер недоступен. нужен https.", "fail");
      return;
    }
    navigator.clipboard.readText().then(function (text) {
      var t = String(text || "").trim();
      if (!t) {
        show("буфер пуст. скопируй что-нибудь.", "fail");
        return;
      }
      if (t === "egrrrtl3nie" || t === "егорвампирокурки") {
        show("пароль принят. кухня открыта.", "ok");
        try {
          var keys = JSON.parse(localStorage.getItem("egor02_keys") || "[]");
          if (keys.indexOf("oven") === -1) keys.push("oven");
          if (keys.indexOf("kurki") === -1) keys.push("kurki");
          localStorage.setItem("egor02_keys", JSON.stringify(keys));
        } catch (e) {}
        setRift(3);
        setTimeout(function () {
          location.href = "kitchen.html";
        }, 1200);
      } else {
        show("не то. попробуй снова.", "fail");
      }
    }).catch(function () {
      show("браузер не дал прочитать буфер.", "fail");
    });
  });
})();
