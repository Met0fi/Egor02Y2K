(function () {
  var seed = document.getElementById("echoSeed");
  if (!seed) return;
  var scraps = [
    { text: "Нашёл второй экземпляр. в первом было написано: 1725, Кисилево, кровь во рту." },
    { text: "позднее на полях увидал: «не перепутай рапорт с книгой».", link: ["лист из журнала", "commits.html"] },
    { text: "01000101 01100111 01110010 01110010\n01110010 01010100 01101100 00110011", link: ["лист с запросом", "permission.html"] }
  ];
  scraps.forEach(function (scrap, index) {
    var section = document.createElement("section");
    section.className = "dir-page echo-scrap";
    section.setAttribute("aria-label", "обрывок " + (index + 1));
    var paper = document.createElement(index === 2 ? "pre" : "p");
    paper.textContent = scrap.text;
    section.appendChild(paper);
    if (scrap.link) {
      var route = document.createElement("a");
      route.href = scrap.link[1];
      route.textContent = scrap.link[0];
      section.appendChild(route);
    }
    seed.after(section);
    seed = section;
  });
})();
