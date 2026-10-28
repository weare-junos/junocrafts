// The client wants every effect on, even when the phone or computer has "Reduce Motion" switched on.
// Set to matchMedia("(prefers-reduced-motion: reduce)").matches to respect that setting again.
const REDUCED = false;

// Karakter listesi: sıra, metin, unvan, şehir ve LinkedIn burada güncellenir.
// photo: "" olan karakterde fotoğraf yerine boş kart görünür.
const CHARACTERS = [
  {
    name: "Caner", photo: "caner",
    role: "Co-founder / Creative Director", location: "TR, Izmir",
    bio: "An artist’s eye, a minimalist’s instinct. Caner has been shaping ideas in agencies since 2010, contributing to major global projects and finding the details that give brands character. Inspired by Roman sculpture, moonlit walks and music, he brings curiosity to every brief. A nature-loving vegan, father of two girls and, in their eyes, a movie star.",
  },
  {
    name: "Jessica", photo: "jessica-v2",
    role: "Co-founder / Client Partner", location: "UK, London",
    bio: "Jessica has a feel for what’s happening now, and the curiosity to ask what comes next. With over five years in advertising, she connects social culture with a growing passion for strategy and design. Sport fuels her energy; art feeds her imagination. She brings both to the table, helping brands find their place in a world that rarely stands still.",
  },
  {
    name: "Oliver", photo: "oliver-v2",
    role: "Co-founder / Client Partner", location: "UK, London",
    bio: "Ten years across different industries have taught Oliver that good partnerships begin with listening. He connects business ambitions with creative possibilities, bringing perspective and a feel for people to the conversation. A lover of literature and music, he appreciates a well-told story, an unexpected harmony and ideas that stay with you long after the conversation ends.",
  },
  {
    name: "Arda", photo: "arda-v2",
    role: "New Business / UK & Europe", location: "UK, London",
    bio: "Long based in London, Arda connects Juno with new conversations across the UK and Europe. His network spans different industries, bringing a broad perspective to the way businesses meet and collaborate. His role is about finding common ground: understanding what a brand needs, recognising where Juno can contribute and giving a promising introduction room to become a lasting partnership.",
  },
  {
    name: "Alptuğ", photo: "alptug-v2",
    role: "Senior Motion Designer", location: "TR, Istanbul",
    bio: "Alptuğ has spent over fifteen years giving ideas rhythm, movement and character. Across projects big and small, he has explored new techniques, pairing a sharp visual eye with a versatile approach to motion. Birds, nature and music feed his curiosity: a world of patterns, sounds and small surprises that keeps his imagination moving.",
  },
  {
    name: "Barış", photo: "baris-v2",
    role: "Head of Business Development", location: "TR, Antalya",
    bio: "Barış likes to go beneath the surface. With over ten years in advertising, he builds strong client relationships and helps brands uncover a clearer strategic direction. The same curiosity takes him underwater, where diving offers a different kind of perspective. Back on land, music, literature and good conversations keep his appetite for discovery alive.",
  },
  {
    name: "Burcu", photo: "burcu-v2",
    role: "Digital Marketing Partner", location: "TR, Izmir",
    bio: "Trained in physics engineering, Burcu found her calling in digital marketing. Over fifteen years, she has brought analytical thinking and a personal touch to helping brands grow, building relationships that become lasting partnerships. Away from the screen, she swaps campaign plans for camping trips, finding fresh perspective in open skies, quiet trails and time spent close to nature.",
  },
  {
    name: "Gülce", photo: "gulce-v2",
    role: "Brand Manager", location: "TR, Izmir",
    bio: "Gülce sees the whole picture and how each part connects. With over ten years in advertising, she brings brand consultancy, digital marketing, PR and events together into integrated strategies shaped around each client. She helps brands find their direction and express it consistently. Away from the briefs, animals and nature hold a special place in her world.",
  },
  {
    name: "Burhan", photo: "burhan-v2",
    role: "Web & App Developer", location: "TR, Antalya",
    bio: "Burhan has spent over twenty-five years turning ideas into things you can click, explore and use. From websites to apps, he combines a designer’s attention with a developer’s instinct for solving the difficult bits. Code is his natural habitat; the sea is another. A keen diver, he is equally drawn to what lies beneath an interface and beneath the waves.",
  },
  {
    name: "Ali", photo: "ali-v2",
    role: "Full Stack Developer", location: "TR, Izmir",
    bio: "Ali connects creative ideas with the technology that brings them to life. With ten years of experience in development, he works across front-end and back-end to build intuitive, reliable digital experiences. He combines an eye for detail with a practical approach to problem-solving, helping turn complex requirements into websites and applications that feel simple to use. Away from the code, his curiosity keeps him exploring new technologies and ideas.",
  },
  {
    name: "Seval", photo: "seval-v2",
    role: "Senior Graphic Designer", location: "TR, Istanbul",
    bio: "Twenty years in graphic design have given Seval a sharp eye, fluency in her tools and a steady hand when deadlines get complicated. She brings clarity to busy briefs and care to the smallest details. A passionate traveller, she collects fresh perspectives wherever she goes: colours, places and little observations that find their way back into her work.",
  },
  {
    name: "Adem", photo: "adem-v2",
    role: "3D Artist", location: "TR, Istanbul",
    bio: "Adem brings over thirty years of advertising experience to the worlds he builds in 3D. After countless agency projects, he found a particular fascination with giving ideas shape, depth and dimension. His craft is grounded in patience and experience; his life, in family, wellbeing and nature. An eye for detail, with a clear sense of what matters.",
  },
];

// Turkish page (tr/index.html) sets window.JUNO_I18N with bios + form messages, and data-root="../" on <html>
const I18N = window.JUNO_I18N || {};
const ROOT = document.documentElement.dataset.root || "";
const msg = (key, en) => (I18N.msgs && I18N.msgs[key]) || en;
const photoSrc = (c) => `${ROOT}assets/team/${c.photo}.webp`;
// wavy white frame (the #stamp-wave path in index.html), inline so its line stays 1px at every size
const FRAME = '<svg class="stamp__frame" viewBox="0 0 100 86" preserveAspectRatio="none" aria-hidden="true"><use href="#stamp-wave"/></svg>';

// ---------- characters ----------
const card = document.querySelector(".char");
const roster = document.querySelector(".roster");
const el = {
  img: document.getElementById("char-img"),
  name: document.getElementById("char-name"),
  bio: document.getElementById("char-bio"),
  role: document.getElementById("char-role"),
  loc: document.getElementById("char-loc"),
};

function fill(c) {
  el.name.textContent = c.name;
  el.bio.textContent = (I18N.bios && I18N.bios[c.name]) || c.bio;
  el.role.textContent = c.role;
  el.loc.textContent = c.location;
  el.img.hidden = !c.photo;
  if (c.photo) { el.img.src = photoSrc(c); el.img.alt = c.name; }
}

// Switching characters (huxleysaga.com style): the old photo is wiped away upwards like a
// curtain while it drifts up, the new one settles in from slightly below, then the text rises in.
const WIPE_MS = 1000;
const WIPE_EASE = "cubic-bezier(.76, 0, .24, 1)";
const photoBox = card.querySelector(".char__photo");
let current = 0;

function select(i, btn) {
  if (i === current) return;
  current = i;
  roster.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", b === btn));
  // keep the chosen card inside the strip without moving the page
  const l = btn.offsetLeft - roster.offsetLeft, r = l + btn.offsetWidth;
  if (l < roster.scrollLeft) roster.scrollTo({ left: l });
  else if (r > roster.scrollLeft + roster.clientWidth) roster.scrollTo({ left: r - roster.clientWidth });

  photoBox.querySelectorAll(".stamp__old").forEach((o) => o.remove());
  const old = document.createElement("div");
  old.className = "stamp__old";
  old.innerHTML = FRAME;
  if (!el.img.hidden) {
    const copy = el.img.cloneNode();
    copy.removeAttribute("id");
    old.appendChild(copy);
  }
  photoBox.appendChild(old);
  fill(CHARACTERS[i]);

  if (REDUCED) { old.remove(); return; }
  const timing = { duration: WIPE_MS, easing: WIPE_EASE, fill: "forwards" };
  old.animate([{ clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)" }], timing)
    .finished.then(() => old.remove()).catch(() => {});
  old.querySelector("img")?.animate(
    [{ transform: "translateX(-50%) translateY(0)" }, { transform: "translateX(-50%) translateY(-30%)" }], timing);
  el.img.animate(
    [{ transform: "translateX(-50%) translateY(12%) scale(1.08)" }, { transform: "translateX(-50%) translateY(0) scale(1)" }],
    { duration: WIPE_MS, easing: WIPE_EASE });
  [...card.querySelector(".char__info").children].forEach((n, k) =>
    n.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
      { duration: 650, delay: 300 + k * 100, easing: "cubic-bezier(.2, .7, .2, 1)", fill: "backwards" }));
}

CHARACTERS.forEach((c, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.setAttribute("role", "tab");
  b.setAttribute("aria-selected", i === 0);
  b.innerHTML = (c.photo
    ? `<div class="stamp">${FRAME}<img src="${photoSrc(c)}" alt="" width="820" height="920"></div>`
    : `<div class="stamp stamp--empty">${FRAME}</div>`)
    + `<span class="roster__name"></span><i class="corners" aria-hidden="true"><b></b><b></b><b></b><b></b></i>`;
  b.querySelector(".roster__name").textContent = c.name;
  b.addEventListener("click", () => {
    if (roster.dataset.dragged) return; // a drag just ended, not a click
    select(i, b);
    if (window.innerWidth <= 960) card.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  roster.appendChild(b);
});
fill(CHARACTERS[0]);

// roster scrolling: arrow buttons, mouse drag, plus native swipe / trackpad
const prevBtn = document.querySelector(".roster__arrow--prev");
const nextBtn = document.querySelector(".roster__arrow--next");
const updateArrows = () => {
  prevBtn.disabled = roster.scrollLeft <= 2;
  nextBtn.disabled = roster.scrollLeft + roster.clientWidth >= roster.scrollWidth - 2;
};
const page = (dir) => roster.scrollBy({ left: dir * roster.clientWidth * 0.8 });
prevBtn.addEventListener("click", () => page(-1));
nextBtn.addEventListener("click", () => page(1));
roster.addEventListener("scroll", updateArrows, { passive: true });
addEventListener("resize", updateArrows);
updateArrows();

let drag = null;
roster.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  drag = { x: e.clientX, left: roster.scrollLeft, moved: false };
});
addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; roster.classList.add("is-dragging"); }
  if (drag.moved) roster.scrollLeft = drag.left - dx;
});
addEventListener("pointerup", () => {
  if (!drag) return;
  if (drag.moved) { roster.dataset.dragged = "1"; setTimeout(() => delete roster.dataset.dragged, 0); }
  roster.classList.remove("is-dragging");
  drag = null;
});

// ---------- mobile menu ----------
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", false); })
);

// ---------- intro: words start grey and fill with red as you scroll ----------
const intro = document.querySelector(".hero__intro");
if (intro) {
  intro.setAttribute("aria-label", intro.textContent.trim().replace(/\s+/g, " "));
  // wrap every word in a span; <br> tags in the HTML are kept as line breaks
  intro.innerHTML = intro.innerHTML.split(/(<br[^>]*>)/).map((part) => part.startsWith("<br") ? part
    : part.trim().split(/\s+/).filter(Boolean).map((w) => `<span aria-hidden="true">${w}</span>`).join(" ")).join(" ");
  const spans = [...intro.querySelectorAll("span")];
  const FROM = [52, 52, 52];   // grey
  const TO = [249, 80, 77];    // --red
  const SOFT = 7;              // how many words the soft edge spans
  let head = 0, target = 0, ticking = false;

  const paint = () => {
    spans.forEach((s, i) => {
      const t = Math.min(1, Math.max(0, (head - i) / SOFT));
      s.style.color = `rgb(${FROM.map((f, k) => Math.round(f + (TO[k] - f) * t)).join(",")})`;
    });
  };
  const measure = () => {
    const r = intro.getBoundingClientRect();
    const vh = window.innerHeight;
    const top = r.top + scrollY, bottom = r.bottom + scrollY;
    const start = Math.max(0, top - vh * 0.9);
    const end = Math.max(start + 220, bottom - vh * 0.4);
    const p = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
    target = p * (spans.length + SOFT);
  };
  const loop = () => {
    head += (target - head) * 0.18;
    paint();
    if (Math.abs(target - head) > 0.01) requestAnimationFrame(loop);
    else { head = target; paint(); ticking = false; }
  };
  const onScroll = () => { measure(); if (!ticking) { ticking = true; requestAnimationFrame(loop); } };

  if (REDUCED) {
    head = spans.length + SOFT; paint();
  } else {
    measure(); head = target; paint();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
  }
}

// ---------- services: each image enters small and zoomed in, then zooms out to full bleed ----------
// (huxleysaga.com style, no cropping). Bigger gap from 1 = more dramatic.
const START_SCALE = 0.72;     // frame size at entry (1 = full width)
const START_SCALE_PHONE = 0.6; // phones: starts clearly small and opens out to full width
const END_IMG_ZOOM = 1.02;    // a hair over 1 so the video's soft edge rows are always clipped (no thin line at the edges)
const START_IMG_ZOOM = 1.3;   // the picture inside starts this zoomed in and settles to 1
const svcMedia = [...document.querySelectorAll(".svc__media")];
if (svcMedia.length && !REDUCED) {
  let queued = false;
  const ease = (t) => t * t * (3 - 2 * t); // slow start + slow finish, so the zoom plays while it is on screen
  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    const phone = window.innerWidth <= 720;
    const s0 = phone ? START_SCALE_PHONE : START_SCALE;
    // the zoom is finished by the time the video sits in view (middle of the screen on phones),
    // so it is never seen zoomed in, which is what cut the astronauts' feet
    const span = phone ? 0.6 : 0.7;
    svcMedia.forEach((m) => {
      const top = m.getBoundingClientRect().top;
      // 0 when the image's top touches the bottom of the screen, 1 when it reaches the top area
      const p = ease(Math.min(1, Math.max(0, (vh - top) / (vh * span))));
      m.style.transform = `scale(${s0 + (1 - s0) * p})`;
      const media = m.firstElementChild;
      if (media) media.style.transform = `scale(${START_IMG_ZOOM + (END_IMG_ZOOM - START_IMG_ZOOM) * p})`;
    });
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  update();
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
}

/* ---------- hero: tiny twinkling stars ---------- */
const starCanvas = document.querySelector(".hero__stars");
if (starCanvas) {
  const ctx = starCanvas.getContext("2d");
  const still = false; // twinkle stays on even with reduced motion: it is a slow fade, nothing travels
  let stars = [], w = 0, h = 0, running = false;

  const build = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = starCanvas.clientWidth; h = starCanvas.clientHeight;
    starCanvas.width = Math.round(w * dpr); starCanvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 6500); // ~140 on desktop, ~50 on a phone
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.45 + Math.random() ** 3 * 1.2,       // mostly pin-pricks, a few slightly bigger
      speed: 0.4 + Math.random() * 1.2,        // seconds-ish per twinkle, varied
      phase: Math.random() * Math.PI * 2,
      peak: 0.6 + Math.random() * 0.4,
    }));
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      // sharpened sine: stars rest dim most of the time and flash briefly
      const wave = still ? 0.5 : (Math.sin(t / 1000 * s.speed + s.phase) + 1) / 2;
      const a = s.peak * wave ** 2.6;
      if (a < 0.02) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      if (s.r > 0.9 && a > 0.5) { // a soft halo on the brightest moments
        ctx.globalAlpha = (a - 0.5) * 0.5;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  const loop = (t) => { if (!running) return; draw(t); requestAnimationFrame(loop); };
  build();
  if (still) draw(0);
  else new IntersectionObserver(([e]) => {
    const was = running; running = e.isIntersecting;
    if (running && !was) requestAnimationFrame(loop);
  }).observe(starCanvas);
  // phones fire resize when the address bar hides; only re-scatter when the width really changes
  addEventListener("resize", () => { if (starCanvas.clientWidth !== w) { build(); if (still) draw(0); } });
}

/* ---------- service videos: load when near the screen, play only while visible ---------- */
const svcVideos = [...document.querySelectorAll(".svc__media video[data-src]")];
if (svcVideos.length && "IntersectionObserver" in window) {
  const visible = new Set();
  // Safari can refuse the very first play() (page still loading) and then never loads a preload="none"
  // video: in that case load it anyway and try again once it can play, or on the next touch/scroll
  const start = (v) => v.play().catch(() => {
    v.preload = "auto"; v.load();
    v.addEventListener("canplay", () => { if (visible.has(v)) v.play().catch(() => {}); }, { once: true });
  });
  const retry = () => visible.forEach((v) => { if (v.paused) v.play().catch(() => {}); });
  addEventListener("touchstart", retry, { passive: true });
  addEventListener("scroll", retry, { passive: true });
  const io = new IntersectionObserver((entries) => entries.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) {
      visible.add(v);
      if (!v.getAttribute("src")) { v.src = v.dataset.src; }
      start(v); // in low-power mode autoplay stays refused and the poster stays
    } else if (v.getAttribute("src")) {
      visible.delete(v);
      // unload off-screen videos: iPhones decode only a few at once, extra ones stay black
      v.pause(); v.removeAttribute("src"); v.load();
    }
  }), { rootMargin: "300px 0px" });
  svcVideos.forEach((v) => io.observe(v));
}

/* ---------- explorer: the astronaut turns his head as you scroll ---------- */
const turn = document.querySelector(".explorer__img");
if (turn) {
  let queued = false, target = 0, shown = 0;
  const section = turn.closest(".explorer");
  const measure = () => {
    const r = section.getBoundingClientRect(), vh = innerHeight;
    // 0 when the section's top enters at the bottom of the screen, 1 when its bottom leaves the top
    target = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
  };
  const step = () => {
    queued = false;
    if (!turn.duration) return;
    shown += (target - shown) * 0.25; // light easing so fast scrolls still turn smoothly
    turn.currentTime = shown * (turn.duration - 0.05);
    if (Math.abs(target - shown) > 0.002) request();
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(step); } };
  const onScroll = () => { measure(); request(); };
  turn.addEventListener("loadedmetadata", onScroll);
  // iPhones ignore preload and won't decode frames for seeking until the video has played once:
  // start it muted the first time it comes near, pause at once, then let the scroll drive it
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    if (turn.readyState >= 2) return;
    const p = turn.play();
    if (p) p.then(() => { turn.pause(); onScroll(); }).catch(() => turn.load());
  }, { rootMargin: "400px 0px" }).observe(section);
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
}

/* ---------- contact form: sends to hello@junocrafts.com via FormSubmit, no page reload ---------- */
const form = document.querySelector(".contact__form");
if (form) {
  const status = form.querySelector(".contact__status");
  const btn = form.querySelector("button[type=submit]");
  // the message box grows with its text instead of showing a scrollbar
  const area = form.elements.message;
  const grow = () => { area.style.height = "auto"; area.style.height = area.scrollHeight + "px"; };
  area.addEventListener("input", grow);
  const say = (text, error = false) => { status.textContent = text; status.classList.toggle("is-error", error); };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.elements.name, email = form.elements.email, message = form.elements.message;
    const okName = name.value.trim().length > 0;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const okMsg = message.value.trim().length > 0;
    name.classList.toggle("is-invalid", !okName);
    email.classList.toggle("is-invalid", !okEmail);
    message.classList.toggle("is-invalid", !okMsg);
    if (!okName) { say(msg("name", "Please tell us your name."), true); name.focus(); return; }
    if (!okEmail) { say(msg("email", "Please enter a valid email address."), true); email.focus(); return; }
    if (!okMsg) { say(msg("message", "Please write a short message."), true); message.focus(); return; }
    if (form.elements._honey.value) return; // bots fill the hidden field
    btn.disabled = true; say(msg("sending", "Sending…"));
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          message: message.value.trim(),
          _replyto: email.value.trim(),
          _subject: `New message from ${name.value.trim()} via the Juno website`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === "false") throw new Error(data.message || res.status);
      form.reset(); grow(); say(msg("sent", "Thank you! Your message is on its way. We will get back to you soon."));
    } catch {
      say(msg("failed", "Something went wrong. Please write to hello@junocrafts.com directly."), true);
    } finally { btn.disabled = false; }
  });
}

/* ---------- story: opening scene ----------
   1) the red section opens out of the ring's centre as you scroll (a growing circle mask),
   2) once mostly open, the ring draws itself and the vertical line grows down,
   3) the heading and every text line rise in from behind a mask, one after another. */
const storyEl = document.querySelector(".story");
if (storyEl && !REDUCED) {
  const ring = storyEl.querySelector(".story__ring");
  const targets = [...storyEl.querySelectorAll(".story__inner h2, .story__inner p")];
  const originals = targets.map((el) => el.innerHTML);
  let builtFor = 0;

  // wrap each visual line in a mask so it can slide up; rebuilt when the width changes
  const splitLines = () => {
    if (builtFor === storyEl.clientWidth) return;
    builtFor = storyEl.clientWidth;
    let n = 0;
    targets.forEach((el, k) => {
      el.innerHTML = originals[k];
      const words = [];
      el.innerHTML = el.innerHTML.split(/(<br[^>]*>)/).map((part) => part.startsWith("<br") ? part
        : part.split(/\s+/).filter(Boolean).map((w) => `<span class="w">${w}</span>`).join(" ")).join(" ");
      el.querySelectorAll(".w").forEach((w) => words.push(w));
      const lines = [];
      words.forEach((w) => {
        const last = lines[lines.length - 1];
        if (last && Math.abs(last.top - w.offsetTop) < 4) last.words.push(w.textContent);
        else lines.push({ top: w.offsetTop, words: [w.textContent] });
      });
      el.innerHTML = lines.map((l) => `<span class="line"><span style="--d:${(0.35 + n++ * 0.07).toFixed(2)}s">${l.words.join(" ")}</span></span>`).join("");
    });
  };

  storyEl.classList.add("is-scene");
  splitLines();
  // measure again once the web font is in, otherwise the lines are cut for the fallback font
  if (document.fonts) document.fonts.ready.then(() => { builtFor = 0; splitLines(); });
  const ease = (t) => t * t * (3 - 2 * t); // slow start and finish, so the opening is visible the whole way
  let queued = false;
  const update = () => {
    queued = false;
    const r = storyEl.getBoundingClientRect(), vh = innerHeight;
    const rr = ring.getBoundingClientRect();
    storyEl.style.setProperty("--iris-y", `${((rr.top + rr.height / 2 - r.top) / r.height * 100).toFixed(1)}%`);
    // 0 when the section's top enters at the bottom of the screen, 1 when it reaches about a quarter from the top
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
    storyEl.style.setProperty("--iris", `${(4 + 96 * ease(p)).toFixed(2)}%`);
    if (p > 0.7) storyEl.classList.add("is-in");
    else if (p < 0.05) storyEl.classList.remove("is-in"); // scrolled back above: replay next time
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  update();
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", () => { splitLines(); request(); });
}

/* ---------- story ring: keep its line 1px at any size (the circle is drawn in a 100-unit viewBox) ---------- */
{
  const ringBox = document.querySelector(".story__ring");
  const circle = ringBox?.querySelector("circle");
  const fit = () => { if (ringBox.offsetWidth) circle.style.strokeWidth = 100 / ringBox.offsetWidth; };
  if (circle) { fit(); addEventListener("resize", fit); }
}
