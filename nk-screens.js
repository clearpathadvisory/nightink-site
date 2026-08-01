/* ── Nightink · live screens ──────────────────────────────────────────
   Save as /nk-screens.js and load with:
     <script src="/nk-screens.js" defer></script>
   just before </body>. No dependencies.
   ───────────────────────────────────────────────────────────────────── */
(function () {
  var REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var panels = document.querySelectorAll(".shots > .nk");
  if (!panels.length) return;

  /* ── the year grid is built here rather than shipped as 266 empty tags ── */
  var HEAT = ["#1A1D24", "#3A2440", "#6B2F58", "#A83E70", "#EC4899", "#C88BE8"];
  var heat = $("nkHeat"), cells = [];
  if (heat) {
    for (var i = 0; i < 266; i++) {
      var c = document.createElement("i"), v = Math.random();
      /* recent weeks denser, so it reads as a habit forming rather than noise */
      var lv = i > 228 ? (v > .5 ? 4 : v > .25 ? 3 : 2)
                       : v > .88 ? 5 : v > .74 ? 4 : v > .56 ? 3 : v > .34 ? 2 : v > .16 ? 1 : 0;
      c.dataset.c = HEAT[lv];
      c.dataset.w = lv > 0 ? 1 : 0;
      cells.push(c); heat.appendChild(c);
    }
  }

  /* ── covers ── */
  var COVERS = [
    ["Ink", ["#2A3038", "#4A5058", "#9FC4DC"]], ["Paper", ["#E8E2D6", "#C9C2B4", "#8A8378"]],
    ["Sepia", ["#3A2E24", "#8A6A44", "#D8B98A"]], ["Moss", ["#243028", "#3F6B50", "#8FBFA0"]],
    ["Plum", ["#2E2434", "#6A4A7E", "#B99FD0"]], ["Rose", ["#F2E4E6", "#D9AEB6", "#A9707E"]],
    ["Sky", ["#E4EEF4", "#AECDDE", "#6E9DB8"]], ["Peach", ["#F6E8DC", "#E8C4A0", "#C89468"]],
    ["Carbon", ["#16181C", "#2E3238", "#6E747C"]], ["Midnight", ["#141A28", "#2A3A5A", "#6A84B8"]],
    ["Clay", ["#2C231F", "#7A5344", "#C09078"]]
  ];
  var cwrap = $("nkCovers");
  if (cwrap) COVERS.forEach(function (c) {
    var d = document.createElement("div"); d.className = "nk-cv";
    d.innerHTML = '<u>' + c[1].map(function (x) {
      return '<s style="background:' + x + '"></s>'; }).join("") + '</u><em>' + c[0] + '</em>';
    cwrap.appendChild(d);
  });

  /* ── typing that behaves like a hand ─────────────────────────────────
     Real typing is not a metronome: letters inside a familiar word come
     fast, the hand breathes at punctuation, stalls before a word that
     needed choosing, and now and then gets one wrong and goes back. */
  var TITLE = "The long way home";
  var BODY = "Walked back along the river instead of taking the bus. Worth the extra twenty minutes just for the light on the water.";
  var THINK = { 22: 520, 46: 380, 74: 640, 96: 300 };   /* index → extra pause */

  function human(el, str, base, opts, done) {
    opts = opts || {};
    var i = 0, txt = "", fixing = null;
    function delay(ch, prev) {
      var d = base * (0.55 + Math.random() * 0.95);
      if (/[.,]/.test(prev)) d += base * 4.5;
      if (prev === " " && /[A-Z]/.test(ch)) d += base * 1.4;
      if (ch === " ") d += base * 0.5;
      if (Math.random() < 0.06) d += base * 3;
      return d;
    }
    (function step() {
      if (fixing !== null) {                        /* backspacing over the typo */
        txt = txt.slice(0, -1); el.textContent = txt; fixing--;
        setTimeout(step, fixing < 0 ? base * 2.6 : base * 1.1);
        if (fixing < 0) fixing = null;
        return;
      }
      if (opts.typo && i === opts.typo.i && !opts.typo.done) {
        txt += opts.typo.wrong; el.textContent = txt; opts.typo.done = true;
        setTimeout(function () { fixing = opts.typo.wrong.length - 1; step(); }, base * 7);
        return;
      }
      var ch = str[i], prev = str[i - 1] || "";
      txt += ch; el.textContent = txt; i++;
      if (i >= str.length) { if (done) setTimeout(done, 420); return; }
      var d = delay(str[i], ch);
      if (opts.think && opts.think[i]) d += opts.think[i];
      setTimeout(step, d);
    })();
  }

  function count(id, to, ms) {
    var el = $(id); if (!el) return;
    var s = performance.now();
    (function f(n) {
      var p = Math.min((n - s) / ms, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    })(s);
  }

  /* ── the four sequences ── */
  function w1() {
    var m = document.querySelectorAll("#nkMoods i");
    m.forEach(function (d, n) { setTimeout(function () { d.classList.add("pop"); }, n * 80); });
    setTimeout(function () { if (m[4]) m[4].classList.add("sel"); }, 700);
    count("nkRun", 7, 900); count("nkKept", 16, 1100);
    var bdy = $("nkBdy"), wc = $("nkWc"), ttl = $("nkTtl");
    if (!bdy || !ttl) return;
    setTimeout(function () {
      human(ttl, TITLE, 62, {}, function () {
        bdy.innerHTML = '<span></span><span class="nk-cr"></span>';
        var sp = bdy.firstChild;
        human(sp, BODY, 46, { think: THINK, typo: { i: 88, wrong: "bua" } }, function () {
          var c = bdy.querySelector(".nk-cr"); if (c) c.remove();
        });
        var iv = setInterval(function () {
          var n = sp.textContent.trim().split(/\s+/).filter(Boolean).length;
          wc.textContent = n + " word" + (n === 1 ? "" : "s");
          if (n >= 22) clearInterval(iv);
        }, 110);
      });
    }, 760);
  }

  function w2() {
    document.querySelectorAll(".nk-tg").forEach(function (t, n) {
      setTimeout(function () { t.classList.add("in"); }, n * 62); });
    document.querySelectorAll(".nk-en").forEach(function (t, n) {
      setTimeout(function () { t.classList.add("in"); }, 640 + n * 150); });
  }

  function seed(instant) {
    var written = 0, days = $("nkDays");
    cells.forEach(function (c, n) {
      var go = function () {
        c.style.background = c.dataset.c;
        if (+c.dataset.w && days) { written++; days.textContent = written; }
      };
      instant ? go() : setTimeout(go, n * 7);
    });
  }
  function w3() { setTimeout(function () { seed(false); }, 300); }

  function w4() {
    if (!cwrap) return;
    var cv = cwrap.querySelectorAll(".nk-cv");
    cv.forEach(function (c, n) { setTimeout(function () { c.classList.add("in"); }, n * 55); });
    var order = [4, 10, 1, 4], k = 0;
    setTimeout(function () {
      cv[0].classList.add("sel");
      setInterval(function () {
        cv.forEach(function (c) { c.classList.remove("sel"); });
        cv[order[k % order.length]].classList.add("sel"); k++;
      }, 1900);
    }, 900);
  }

  var SEQ = [w1, w2, w3, w4];

  /* reduced motion, or no observer: show the finished state, move nothing */
  function finish(i) {
    if (i === 0) {
      if ($("nkTtl")) $("nkTtl").textContent = TITLE;
      if ($("nkBdy")) $("nkBdy").textContent = BODY;
      document.querySelectorAll("#nkMoods i").forEach(function (d) { d.classList.add("pop"); });
      if ($("nkWc")) $("nkWc").textContent = "22 words";
      if ($("nkRun")) $("nkRun").textContent = "7";
      if ($("nkKept")) $("nkKept").textContent = "16";
    }
    if (i === 1) document.querySelectorAll(".nk-tg,.nk-en").forEach(function (t) { t.classList.add("in"); });
    if (i === 2) seed(true);
    if (i === 3 && cwrap) cwrap.querySelectorAll(".nk-cv").forEach(function (c) { c.classList.add("in"); });
  }

  if (REDUCE || !("IntersectionObserver" in window)) {
    panels.forEach(function (p, i) { p.classList.add("in"); finish(i); });
    return;
  }

  /* ── each panel starts when it is genuinely on screen ──
     Below 760px .shots scrolls sideways, so the panel can be in the page
     but off to the right. Watching the viewport covers both cases. */
  var started = [];
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = [].indexOf.call(panels, e.target);
      if (started[i]) return;
      started[i] = true;
      setTimeout(function () { e.target.classList.add("in"); SEQ[i](); }, i * 120);
      io.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  panels.forEach(function (p) { io.observe(p); });
})();
