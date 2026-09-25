(function () {
  var img = document.getElementById("cakePic");
  if (!img) return;
  Promise.all(["assets/k0.txt", "assets/k1.txt"].map(function (p) {
    return fetch(p).then(function (r) { return r.text(); });
  })).then(function (parts) {
    img.src = "data:image/jpeg;base64," + parts.join("").replace(/\s+/g, "");
  });
})();
