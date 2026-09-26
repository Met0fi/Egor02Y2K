(function () {
  var img = document.getElementById("cakePic");
  var canvas = document.getElementById("cakeNoise");
  var glyphs = document.getElementById("cakeGlyphs");
  var permissions = document.getElementById("cakePermissions");
  var soundButton = document.getElementById("cakeSound");
  if (!img || !canvas || !glyphs || !permissions) return;

  var context = canvas.getContext("2d");
  var active = false;
  var intensity = 0;
  var soundOn = true;
  var audioContext = null;
  var noiseCanvas = document.createElement("canvas");
  var noiseContext = noiseCanvas.getContext("2d");
  var glyphSet = "▒░▓█╳╱╲╬╫╪??//\\[]{}<>";

  fetch("assets/cake.txt").then(function (response) {
    if (!response.ok) throw new Error("cake asset unavailable");
    return response.text();
  }).then(function (text) {
    img.src = "data:image/jpeg;base64," + text.replace(/\s+/g, "");
  }).catch(function () {
    img.alt = "файл торта не прочитан";
  });

  function resize() {
    canvas.width = Math.max(160, Math.floor(window.innerWidth / 5));
    canvas.height = Math.max(90, Math.floor(window.innerHeight / 5));
    noiseCanvas.width = canvas.width;
    noiseCanvas.height = canvas.height;
  }

  function hash(x, y, t) {
    var n = Math.sin(x * 12.9898 + y * 78.233 + t * 37.719) * 43758.5453;
    return n - Math.floor(n);
  }

  function renderNoise(now) {
    if (!active) return;
    var w = noiseCanvas.width;
    var h = noiseCanvas.height;
    var data = noiseContext.createImageData(w, h);
    var time = now * 0.00065;
    for (var y = 0; y < h; y += 1) {
      for (var x = 0; x < w; x += 1) {
        var p = (y * w + x) * 4;
        var n = hash(x * 0.61, y * 0.77, time);
        var m = hash(x * 1.71 + 13, y * 1.31 - 7, time * 1.8);
        var red = Math.floor(18 + n * 105 + m * 50 * intensity);
        var black = Math.floor(5 + (1 - n) * 18);
        data.data[p] = red;
        data.data[p + 1] = black;
        data.data[p + 2] = black;
        data.data[p + 3] = Math.floor((0.18 + intensity * 0.12) * 255);
      }
    }
    noiseContext.putImageData(data, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;
    context.drawImage(noiseCanvas, 0, 0);
    requestAnimationFrame(renderNoise);
  }

  function createGlyph() {
    var span = document.createElement("span");
    span.className = "cake-glyph";
    span.textContent = glyphSet.charAt(Math.floor(Math.random() * glyphSet.length));
    span.style.left = Math.floor(Math.random() * 96) + "%";
    span.style.top = Math.floor(Math.random() * 94) + "%";
    span.style.transform = "rotate(" + Math.floor(Math.random() * 80 - 40) + "deg)";
    span.style.opacity = String(0.35 + Math.random() * 0.6);
    glyphs.appendChild(span);
  }

  function createWormCensor() {
    var strip = document.createElement("span");
    strip.className = "worm-censor";
    strip.textContent = "████████████";
    strip.style.left = Math.floor(5 + Math.random() * 78) + "%";
    strip.style.top = Math.floor(8 + Math.random() * 78) + "%";
    strip.style.width = Math.floor(64 + Math.random() * 180) + "px";
    strip.style.transform = "rotate(" + Math.floor(Math.random() * 22 - 11) + "deg)";
    glyphs.appendChild(strip);
  }

  function playScrape() {
    if (!soundOn) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      var duration = 1.15;
      var buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * duration), audioContext.sampleRate);
      var samples = buffer.getChannelData(0);
      var last = 0;
      for (var i = 0; i < samples.length; i += 1) {
        var t = i / audioContext.sampleRate;
        var white = Math.random() * 2 - 1;
        last = last * 0.94 + white * 0.06;
        var scrape = white - last;
        var teeth = Math.sin(t * 210 + Math.sin(t * 17) * 8) * 0.22;
        var gate = Math.sin(t * 8.5) > 0.2 ? 1 : 0.22;
        var envelope = Math.min(1, t * 24) * Math.max(0, 1 - t / duration);
        samples[i] = (scrape * 0.78 + teeth + last * 0.3) * gate * envelope;
      }
      var source = audioContext.createBufferSource();
      var band = audioContext.createBiquadFilter();
      var gain = audioContext.createGain();
      source.buffer = buffer;
      band.type = "bandpass";
      band.frequency.setValueAtTime(330, audioContext.currentTime);
      band.frequency.linearRampToValueAtTime(1800, audioContext.currentTime + 0.23);
      band.frequency.linearRampToValueAtTime(240, audioContext.currentTime + duration);
      band.Q.value = 2.7;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.42, audioContext.currentTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      source.connect(band);
      band.connect(gain);
      gain.connect(audioContext.destination);
      source.start();
    } catch (error) {
      soundOn = false;
    }
  }

  function dismiss(card) {
    card.remove();
    schedulePermission();
  }

  function showPermission() {
    if (!active) return;
    var services = ["камеру", "микрофон", "уведомления"];
    var service = services[Math.floor(Math.random() * services.length)];
    var card = document.createElement("section");
    card.className = "permission-card";
    var title = document.createElement("strong");
    title.textContent = "локальный запрос";
    var copy = document.createElement("p");
    copy.textContent = "разрешить странице включить " + service + "? ничего не читается и никуда не отправляется.";
    var actions = document.createElement("div");
    actions.className = "permission-actions";
    ["разрешить", "отклонить"].forEach(function (label) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn3d";
      button.textContent = label;
      button.addEventListener("click", function () {
        playScrape();
        dismiss(card);
      });
      actions.appendChild(button);
    });
    card.appendChild(title);
    card.appendChild(copy);
    card.appendChild(actions);
    permissions.appendChild(card);
  }

  function schedulePermission() {
    window.setTimeout(showPermission, 6000 + Math.floor(Math.random() * 4000));
  }

  function startDecay() {
    if (!active) {
      active = true;
      intensity = 0.72;
      document.documentElement.dataset.final = "1";
      playScrape();
      resize();
      requestAnimationFrame(renderNoise);
      schedulePermission();
    }
    intensity = Math.min(1, intensity + 0.045);
    createGlyph();
    createGlyph();
    createWormCensor();
    playScrape();
  }

  img.addEventListener("click", startDecay);
  document.body.addEventListener("click", function (event) {
    if (event.target === canvas || event.target === glyphs || event.target === document.body) startDecay();
  });
  if (soundButton) {
    soundButton.addEventListener("click", function () {
      soundOn = !soundOn;
      soundButton.textContent = soundOn ? "ЗВУК: ВКЛ." : "ЗВУК: ВЫКЛ.";
      if (soundOn) playScrape();
    });
  }
  window.addEventListener("resize", resize);
  resize();
})();

