(function () {
  document.documentElement.removeAttribute("data-decay");
  var hideIds = ["whisper", "kitchenHint", "fileWander"];
  hideIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.hidden = true;
  });

  function accept(v) {
    v = String(v || "").trim().toLowerCase().replace(/\s+/g, "");
    return v === "egrrrtl3nie" || v === "егорвампирокурки";
  }
  function openKitchen() {
    try {
      var keys = JSON.parse(localStorage.getItem("egor02_keys") || "[]");
      if (keys.indexOf("oven") === -1) keys.push("oven");
      if (keys.indexOf("kurki") === -1) keys.push("kurki");
      localStorage.setItem("egor02_keys", JSON.stringify(keys));
      localStorage.setItem("egor02_rift", "7");
    } catch (e) {}
    location.href = "kitchen.html";
  }
  ["commitForm", "ovenForm"].forEach(function (id) {
    var form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      var box = form.elements.pass;
      if (box && accept(box.value)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        openKitchen();
      }
    }, true);
  });

  if (location.pathname.indexOf("glaza") === -1 && location.pathname.indexOf("couldjustbite") === -1) return;
  var seed = document.getElementById("echoSeed");
  if (!seed) return;
  var n = 0;
  var busy = false;
  function copy() {
    if (n >= 36 || busy) return;
    busy = true;
    n += 1;
    var block = seed.cloneNode(true);
    block.removeAttribute("id");
    block.setAttribute("data-echo", String(n));
    if (n === 17) {
      var scrap = document.createElement("pre");
      scrap.className = "file-pre";
      scrap.textContent = "01000101 01100111 01110010 01110010\n01110010 01010100 01101100 00110011";
      block.appendChild(scrap);
    }
    if (n === 28) {
      var p = document.createElement("p");
      p.innerHTML = '<a href="commits.html">cvs</a>';
      block.appendChild(p);
    }
    seed.parentNode.appendChild(block);
    busy = false;
  }
  var guard = 0;
  while (n < 36 && guard < 8 && document.documentElement.scrollHeight < window.innerHeight + 160) {
    copy();
    guard += 1;
  }
  window.addEventListener("scroll", function () {
    if (window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 280) copy();
  });
})();
