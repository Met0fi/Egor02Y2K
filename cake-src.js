(function () {
  var img = document.getElementById("cakePic");
  if (!img) return;
  var files = ["assets/k0.txt", "assets/k1.txt", "assets/k2.txt", "assets/k3.txt"];
  Promise.all(files.map(function (p) {
    return fetch(p).then(function (r) { return r.text(); });
  })).then(function (parts) {
    img.src = "data:image/jpeg;base64," + parts.join("").replace(/\s+/g, "");
  });
})();
