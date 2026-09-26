(function () {
  var image = document.getElementById("cakePic");
  if (!image) return;
  fetch("assets/cake.txt")
    .then(function (response) { return response.text(); })
    .then(function (content) {
      image.src = "data:image/jpeg;base64," + content.replace(/\s+/g, "");
    })
    .catch(function () {
      image.alt = "торт не загрузился";
    });
  if (document.documentElement.dataset.page === "cake") {
    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (window.EgorFinale) window.EgorFinale.start();
      }
    });
    image.tabIndex = 0;
  }
})();

