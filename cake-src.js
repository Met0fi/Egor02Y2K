(function () {
  var img = document.getElementById("cakePic");
  if (!img) return;
  var files = [];
  for (var i = 0; i < 13; i++) files.push("assets/p" + (i < 10 ? "0" + i : i) + ".txt");
  Promise.all(files.map(function (p) {
    return fetch(p).then(function (r) { return r.text();
    });
  })).then(function (parts) {
    img.src = "data:image/jpeg;base64," + parts.join("").replace(/\s+/g, "");
  });
})();
