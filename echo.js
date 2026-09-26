(function () {
  "use strict";
  var seed = document.getElementById("echoSeed");
  if (!seed) return;
  var count = 0;
  var clues = [
    "зеркало не копирует текст. оно копирует порядок.",
    "два байта на букву. читай не сверху вниз, а по времени.",
    "04.08.2004 03:17 — это дверь, не дата рождения.",
    "у печи два слова. одно приносит уголь, второе открывает ночь."
  ];
  function addEcho() {
    if (count >= 8) return;
    count += 1;
    var block = seed.cloneNode(true);
    block.removeAttribute("id");
    block.dataset.echo = String(count);
    if (clues[count - 1]) {
      var note = document.createElement("p");
      note.className = "file-pre";
      note.textContent = clues[count - 1];
      block.appendChild(note);
    }
    if (count === 6) {
      var link = document.createElement("p");
      link.innerHTML = '<a href="commits.html">открыть cvs</a>';
      block.appendChild(link);
    }
    if (count === 8) {
      var finalLink = document.createElement("p");
      finalLink.innerHTML = '<a href="kitchen.html">дальше — печь</a>';
      block.appendChild(finalLink);
    }
    seed.parentNode.appendChild(block);
    document.documentElement.dataset.echo = count < 3 ? "1" : count < 6 ? "2" : "3";
  }
  for (var initial = 0; initial < 2; initial += 1) addEcho();
  window.addEventListener("scroll", function () {
    if (window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 240) addEcho();
  });
})();
