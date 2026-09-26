(function () {
  var img = document.getElementById("cakePic");
  if (!img) return;
  fetch("assets/cake.txt").then(function (r) { return r.text(); }).then(function (t) {
    img.src = "data:image/jpeg;base64," + t.replace(/\s+/g, "");
  });
})();
