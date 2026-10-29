/* Google Analytics 4 behind a cookie banner.
   Nothing is loaded from Google and no cookie is written until the visitor accepts
   (what GDPR in the UK/EU and KVKK in Türkiye ask for). The choice is kept in localStorage.
   To reuse on another site: change GA_ID, STORE_KEY and the texts below; keep the rest. */
(() => {
  const GA_ID = "G-H4SYS30V98";        // Measurement ID from GA: Admin > Data streams > Web
  const STORE_KEY = "juno-analytics";  // "granted" or "denied"

  const tr = document.documentElement.lang === "tr";
  const T = tr ? {
    title: "Çerez Kullanımı",
    text: "Web sitemizde deneyiminizi geliştirmek ve site kullanımını analiz etmek için çerezler kullanıyoruz. Detaylı bilgi için ",
    link: "Çerez Politikamızı", after: " inceleyebilirsiniz.",
    accept: "Tümünü Kabul Et", reject: "Tümünü Reddet", settings: "Çerez Ayarları", save: "Seçimi Kaydet",
    necessary: "Zorunlu çerezler", necessaryText: "Sitenin çalışması ve çerez tercihinizin hatırlanması için gereklidir.", always: "Her zaman açık",
    analytics: "Analitik çerezler", analyticsText: "Google Analytics ile ziyaret sayısını ve hangi sayfaların görüntülendiğini ölçer.",
    label: "Çerez tercihi",
  } : {
    title: "Cookies",
    text: "We use cookies to improve your browsing experience and analyze website traffic. By clicking \u201cAccept All\u201d, you consent to our use of cookies. ",
    link: "Cookie Policy", after: "",
    accept: "Accept All", reject: "Reject All", settings: "Cookie Settings", save: "Save Choices",
    necessary: "Necessary cookies", necessaryText: "Needed for the website to work and to remember your cookie choice.", always: "Always on",
    analytics: "Analytics cookies", analyticsText: "Google Analytics counts visits and shows which pages are viewed.",
    label: "Cookie choice",
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
  const clearCookies = () => { // after "Reject" that follows an earlier "Accept"
    const host = location.hostname.replace(/^www\./, "");
    document.cookie.split("; ").map((c) => c.split("=")[0]).filter((n) => n === "_ga" || n.startsWith("_ga_"))
      .forEach((n) => [host, "." + host, ""].forEach((d) => {
        document.cookie = `${n}=; path=/; max-age=0${d ? "; domain=" + d : ""}`;
      }));
  };

  const decide = (v) => {
    save(v);
    if (v === "granted") load();
    else if (loaded) { clearCookies(); location.reload(); } // stop GA that was already running
    else clearCookies();
    hide();
  };

  let bar = null;
  const hide = () => { if (bar) { bar.remove(); bar = null; } };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  const button = (cls, text, onClick) => { const b = el("button", cls, text); b.type = "button"; b.addEventListener("click", onClick); return b; };

  // first layer: short notice + Accept All / Reject All / Cookie Settings
  const notice = () => {
    bar.replaceChildren();
    const body = el("div", "consent__body");
    const p = el("p", "consent__text");
    p.append(el("strong", "", T.title), T.text);
    const privacy = document.querySelector('a[href$="privacy.html"]');
    if (privacy) { const a = el("a", "", T.link); a.href = privacy.getAttribute("href") + "#cookies"; p.append(a); }
    p.append(T.after);
    body.append(p);
    const btns = el("div", "consent__btns");
    btns.append(
      button("consent__btn consent__btn--ghost", T.reject, () => decide("denied")),
      button("consent__btn", T.accept, () => decide("granted")),
      button("consent__link", T.settings, settings),
    );
    bar.append(body, btns);
  };

  // second layer: one switch per category
  const settings = () => {
    bar.replaceChildren();
    bar.classList.add("consent--settings");
    const list = el("div", "consent__body");
    list.append(el("p", "consent__title", T.settings));
    const row = (name, text, control) => {
      const r = el("label", "consent__row");
      const t = el("span", "consent__rowtext");
      t.append(el("strong", "", name), el("span", "", text));
      r.append(t, control);
      return r;
    };
    list.append(row(T.necessary, T.necessaryText, el("span", "consent__always", T.always)));
    const box = el("input", "consent__switch");
    box.type = "checkbox";
    box.checked = read() === "granted";
    box.setAttribute("aria-label", T.analytics);
    list.append(row(T.analytics, T.analyticsText, box));
    const btns = el("div", "consent__btns");
    btns.append(
      button("consent__btn consent__btn--ghost", T.save, () => decide(box.checked ? "granted" : "denied")),
      button("consent__btn", T.accept, () => decide("granted")),
    );
    bar.append(list, btns);
  };

  const show = (layer) => {
    if (!ready) return;
    if (!bar) {
      bar = el("div", "consent");
      bar.setAttribute("role", "dialog");
      bar.setAttribute("aria-label", T.label);
      document.body.appendChild(bar);
    }
    bar.classList.remove("consent--settings");
    (layer === "settings" ? settings : notice)();
  };

  // "Cookie settings" in the footer opens the banner again
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cookie-settings]")) { e.preventDefault(); show("settings"); }
  });

  const choice = read();
  if (choice === "granted") load();
  else if (choice !== "denied") {
    if (document.body) show(); else document.addEventListener("DOMContentLoaded", () => show());
  }
})();
