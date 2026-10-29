/* Google Analytics 4 behind a cookie banner.
   Nothing is loaded from Google and no cookie is written until the visitor clicks Accept
   (what GDPR in the UK/EU and KVKK in Türkiye ask for). The choice is kept in localStorage.
   To reuse on another site: change GA_ID, STORE_KEY and the texts below; keep the rest. */
(() => {
  const GA_ID = "G-H4SYS30V98";        // Measurement ID from GA: Admin > Data streams > Web
  const STORE_KEY = "juno-analytics";  // "granted" or "denied"

  const tr = document.documentElement.lang === "tr";
  // wording follows the common pattern (e.g. GOV.UK): a short question, one line on why, equal Accept / Reject
  const T = tr ? {
    title: "Analitik çerezleri kullanabilir miyiz?",
    text: "Sitemizin nasıl kullanıldığını anlamamıza ve onu geliştirmemize yardımcı olurlar. Bunun için Google Analytics kullanıyoruz.",
    accept: "Kabul et", decline: "Reddet", more: "Gizlilik Politikası", label: "Çerez tercihi",
  } : {
    title: "Can we use analytics cookies?",
    text: "They help us understand how our website is used, so we can improve it. We use Google Analytics for this.",
    accept: "Accept", decline: "Reject", more: "Privacy Policy", label: "Cookie choice",
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  let loaded = false;
  const ready = /^G-[A-Z0-9]{4,}$/.test(GA_ID) && !GA_ID.includes("XXXX");

  const load = () => {
    if (loaded || !ready) return;
    loaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID);
  };

  // custom events from main.js (mail click, form sent, language switch); ignored without consent
  window.junoTrack = (name, params) => { if (loaded) gtag("event", name, params || {}); };

  const read = () => { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* private mode: ask again next time */ } };
  const clearCookies = () => { // after a "Decline" that follows an earlier "Accept"
    const host = location.hostname.replace(/^www\./, "");
    document.cookie.split("; ").map((c) => c.split("=")[0]).filter((n) => n === "_ga" || n.startsWith("_ga_"))
      .forEach((n) => [host, "." + host, ""].forEach((d) => {
        document.cookie = `${n}=; path=/; max-age=0${d ? "; domain=" + d : ""}`;
      }));
  };

  let bar = null;
  const hide = () => { if (bar) { bar.remove(); bar = null; } };
  const show = () => {
    if (bar || !ready) return;
    const privacy = document.querySelector('a[href$="privacy.html"]');
    bar = document.createElement("div");
    bar.className = "consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", T.label);
    bar.innerHTML = `<p class="consent__text"></p><div class="consent__btns">
      <button type="button" class="consent__btn consent__btn--ghost" data-choice="denied"></button>
      <button type="button" class="consent__btn" data-choice="granted"></button></div>`;
    const p = bar.querySelector(".consent__text");
    const strong = document.createElement("strong");
    strong.textContent = T.title;
    p.append(strong, " " + T.text + " ");
    if (privacy) {
      const a = document.createElement("a");
      a.href = privacy.getAttribute("href");
      a.textContent = T.more;
      p.appendChild(a);
    }
    bar.querySelector('[data-choice="granted"]').textContent = T.accept;
    bar.querySelector('[data-choice="denied"]').textContent = T.decline;
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("[data-choice]");
      if (!b) return;
      save(b.dataset.choice);
      if (b.dataset.choice === "granted") load();
      else if (loaded) { clearCookies(); location.reload(); } // stop GA that was already running
      else clearCookies();
      hide();
    });
    document.body.appendChild(bar);
  };

  // "Cookie settings" in the footer opens the banner again
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cookie-settings]")) { e.preventDefault(); show(); }
  });

  const choice = read();
  if (choice === "granted") load();
  else if (choice !== "denied") {
    if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
  }
})();
