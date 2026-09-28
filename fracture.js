(function () {
  "use strict";

  var permutation = new Uint8Array(512);
  var source = Array.from({ length: 256 }, function (_, index) { return index; });
  var seed = 2004;
  for (var i = 255; i > 0; i -= 1) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    var pick = (seed >>> 0) % (i + 1);
    var swap = source[i];
    source[i] = source[pick];
    source[pick] = swap;
  }
  for (var p = 0; p < 512; p += 1) permutation[p] = source[p & 255];

  var gradients = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];

  function corner(hash, x, y) {
    var radius = 0.5 - x * x - y * y;
    if (radius <= 0) return 0;
    var gradient = gradients[hash & 7];
    return radius * radius * radius * radius * (gradient[0] * x + gradient[1] * y);
  }

  function simplex(x, y) {
    var skew = (x + y) * 0.3660254037844386;
    var cellX = Math.floor(x + skew);
    var cellY = Math.floor(y + skew);
    var unskew = (cellX + cellY) * 0.21132486540518713;
    var localX = x - (cellX - unskew);
    var localY = y - (cellY - unskew);
    var stepX = localX > localY ? 1 : 0;
    var stepY = localX > localY ? 0 : 1;
    var midX = localX - stepX + 0.21132486540518713;
    var midY = localY - stepY + 0.21132486540518713;
    var endX = localX - 1 + 0.42264973081037427;
    var endY = localY - 1 + 0.42264973081037427;
    var ix = cellX & 255;
    var iy = cellY & 255;
    return 70 * (
      corner(permutation[ix + permutation[iy]], localX, localY) +
      corner(permutation[ix + stepX + permutation[iy + stepY]], midX, midY) +
      corner(permutation[ix + 1 + permutation[iy + 1]], endX, endY)
    );
  }

  function showExit() {
    if (document.querySelector(".fracture-exit")) return;
    var exit = document.createElement("a");
    exit.className = "fracture-exit";
    exit.href = "index.html";
    exit.textContent = "index.html";
    document.body.appendChild(exit);
    exit.focus();
  }

  function startFracture(firstClick) {
    if (document.getElementById("fractureNoise")) {
      if (firstClick) showExit();
      return;
    }
    document.documentElement.classList.add("fractured");
    var canvas = document.createElement("canvas");
    canvas.id = "fractureNoise";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    var context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var frame = 0;
    var last = 0;

    function resize() {
      canvas.width = Math.min(320, Math.ceil(innerWidth / 4));
      canvas.height = Math.min(192, Math.ceil(innerHeight / 4));
    }

    function paint(now) {
      if (!reduced && now - last < 50) {
        requestAnimationFrame(paint);
        return;
      }
      last = now;
      var image = context.createImageData(canvas.width, canvas.height);
      var data = image.data;
      var drift = frame * 0.035;
      var tear = Math.floor((simplex(drift * 0.17, 8.3) + 1) * canvas.height * 0.35);
      for (var y = 0; y < canvas.height; y += 1) {
        var offset = Math.abs(y - tear) < 3 ? 12 : 0;
        for (var x = 0; x < canvas.width; x += 1) {
          var coarse = simplex((x + offset) * 0.087 + drift, y * 0.12 - drift * 0.6);
          var grain = simplex(x * 0.67 - drift * 4, y * 0.73 + drift * 3);
          var red = coarse + grain * 0.22 > 0.06;
          var index = (y * canvas.width + x) * 4;
          data[index] = red ? 176 + Math.floor(Math.max(0, grain) * 70) : 4;
          data[index + 1] = red ? 7 : 1;
          data[index + 2] = red ? 18 : 4;
          data[index + 3] = 255;
        }
      }
      context.putImageData(image, 0, 0);
      frame += 1;
      if (!reduced) requestAnimationFrame(paint);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(paint);
    if (!reduced) {
      window.setInterval(function () {
        document.body.classList.add("fracture-shift");
        window.setTimeout(function () { document.body.classList.remove("fracture-shift"); }, 190);
      }, 2600);
    }
    if (firstClick) showExit();
  }

  window.startFracture = startFracture;
})();
