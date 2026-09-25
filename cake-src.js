(function () {
  var img = document.getElementById("cakePic");
  if (!img) return;
  var files = ["assets/c0.txt", "assets/c1.txt", "assets/c2.txt", "assets/c3.txt"];
  Promise.all(files.map(function (p) { return fetch(p).then(function (r) { return r.text(); }); }))
    .then(function (parts) {
      img.src = "data:image/jpeg;base64," + parts.join("").replace(/\s+/g, "");
    });
})();
