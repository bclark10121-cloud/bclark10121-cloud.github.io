/* Play counts for The Game Shelf and every game page.
   BC, 2026-11-21: show how many times each game has been played, for everyone, on the
   Game Shelf cards and on each game page. One play is one tap on the game page's
   "Play in your browser" button (G6.13 note, G1.10, G1.13). The game itself sends nothing.

   The count lives at Abacus (abacus.jasoncameron.dev), a free counting service with no
   account. Namespace bc-game-shelf, one key per game repo. The tap sends the game's repo
   name and nothing else: no name, no account, no cookie and no player ID.

   No count is added:
   - on a ?test page (G7.8) or in an automated browser,
   - in a browser where BC turned his own plays off. Open
     https://bclark10121-cloud.github.io/?plays=off once to leave this browser out,
     and ?plays=on to count it again.
   If Abacus is down or busy, the count stays hidden and nothing else changes. */
(() => {
  "use strict";
  const API = "https://abacus.jasoncameron.dev";
  const NS = "bc-game-shelf";
  const CACHE_MS = 60 * 1000;   // Abacus allows 30 requests per 10 s per visitor. The shelf asks 15
  const OFF = "bc-plays-off";

  const store = (s) => { try { return window[s]; } catch (e) { return null; } };
  const local = store("localStorage"), session = store("sessionStorage");

  // ?plays=off and ?plays=on set or clear this browser's opt-out
  try {
    const p = new URLSearchParams(location.search).get("plays");
    if (local && p === "off") local.setItem(OFF, "1");
    if (local && p === "on") local.removeItem(OFF);
  } catch (e) {}

  const skip = () => {
    try {
      if (/[?&]test(?:[=&]|$)/.test(location.search)) return true;
      if (navigator.webdriver) return true;
      return !!local && local.getItem(OFF) === "1";
    } catch (e) { return false; }
  };
  const okKey = (k) => /^[a-z0-9-]{3,64}$/.test(k || "");
  const fmt = (n) => n.toLocaleString("en-US") + (n === 1 ? " play" : " plays");

  function cached(slug) {
    try {
      const c = JSON.parse(session.getItem("bc-plays:" + slug));
      if (c && Date.now() - c.t < CACHE_MS) return c.v;
    } catch (e) {}
    return undefined;
  }
  function remember(slug, v) {
    try { session.setItem("bc-plays:" + slug, JSON.stringify({ t: Date.now(), v })); } catch (e) {}
  }
  function forget(slug) {
    try { session.removeItem("bc-plays:" + slug); } catch (e) {}
  }

  // The count for one game, or null when it cannot be read. A game with no plays yet is 0
  async function get(slug) {
    if (!okKey(slug)) return null;
    const c = cached(slug);
    if (c !== undefined) return c;
    try {
      const r = await fetch(`${API}/get/${NS}/${slug}`, { credentials: "omit", cache: "no-store" });
      if (r.status === 404) { remember(slug, 0); return 0; }
      if (!r.ok) return null;
      const n = Number((await r.json()).value);
      if (!Number.isFinite(n) || n < 0) return null;
      remember(slug, n);
      return n;
    } catch (e) { return null; }
  }

  // Adds one play. keepalive lets the request finish while the browser opens the game
  function hit(slug) {
    if (!okKey(slug) || skip()) return;
    forget(slug);
    try {
      fetch(`${API}/hit/${NS}/${slug}`, { credentials: "omit", cache: "no-store", keepalive: true }).catch(() => {});
    } catch (e) {}
  }

  window.BCPlays = { get, hit, fmt };

  // The Game Shelf: a count on each card's meta line, after the Updated stamp
  function shelf() {
    document.querySelectorAll(".card[data-repo]").forEach(async (card) => {
      const meta = card.querySelector(".meta");
      if (!meta) return;
      const n = await get(card.dataset.repo);
      if (n === null) return;
      let span = meta.querySelector(".plays");
      if (!span) {
        span = document.createElement("span");
        span.className = "plays";
        meta.append(" ", span);
      }
      span.textContent = "· " + fmt(n);
    });
  }

  // A game page: count taps on Play in your browser, show the total under the version line
  function gamePage() {
    const slug = location.pathname.split("/").filter(Boolean)[0];
    if (!okKey(slug)) return;
    const play = [...document.querySelectorAll("a")].find((a) => a.textContent.trim() === "Play in your browser");
    if (!play) return;
    const tap = (ev) => { if (ev.type === "click" || ev.button === 1) hit(slug); };
    play.addEventListener("click", tap);
    play.addEventListener("auxclick", tap);

    const cta = play.closest(".cta") || play.parentElement;
    const anchor = cta && cta.nextElementSibling && cta.nextElementSibling.matches("p.note") ? cta.nextElementSibling : cta;
    const show = async () => {
      const n = await get(slug);
      if (n === null || !anchor) return;
      let p = document.querySelector("p.plays");
      if (!p) {
        p = document.createElement("p");
        p.className = "note plays";
        anchor.after(p);
      }
      p.textContent = "Played " + n.toLocaleString("en-US") + (n === 1 ? " time" : " times") + " in the browser so far.";
    };
    show();
    // Back from the game: read the count again so the new play shows
    window.addEventListener("pageshow", (e) => { if (e.persisted) { forget(slug); show(); } });
  }

  const start = () => (document.querySelector(".card[data-repo]") ? shelf() : gamePage());
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
