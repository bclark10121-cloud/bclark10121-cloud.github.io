# The Game Shelf

The games dashboard: one page that lists every game: https://bclark10121-cloud.github.io/

It shows one card per game with a picture, a short description and a link to the game's own page. Each game page has the Play in your browser button and the Android download.

## Add a game

1. Put a 960 x 540 screenshot in `images/<repo>.jpg`.
2. Copy a card in `index.html`. Change `data-repo`, the picture, the name, the tag line, the description and the links.
3. Push. GitHub Pages publishes the root of `main`.

## Featured game

One game sits in the Featured block above the list, with a bigger picture and a Featured game badge. Today that is Keeper of the Hollow (BC, 2026-11-17). The sort never moves it. Its card still follows G2.7: every release refreshes its picture, its Updated stamp and its text in the Featured block, not in the grid.

To feature another game, move its card text into the Featured block and put the old featured game back in the grid as a normal card. A way to switch the featured game, or to feature the most recently updated game on its own, is in the studio backlog (`game-studio/BACKLOG.md`, item S1).

## Play counts

Every card shows how many times the game has been played, after the Updated stamp: `· 1,234 plays` (BC, 2026-11-21). Each game page shows the same count under its version line.

- One play is one tap on the game page's Play in your browser button. The game itself sends nothing, so G6.13 still holds for every game build. Android plays and direct links to a game's `play/` folder do not count.
- `plays.js` at the root of this site does all of it. Every game page loads it with `<script src="/plays.js" defer></script>`, so a fix here reaches every game at once.
- The counts live at Abacus (`https://abacus.jasoncameron.dev`), a free counting service with no account. Namespace `bc-game-shelf`, one key per game repo, such as `bc-game-shelf/lo-fi-league`. A key stays alive while it is read at least once every 6 months.
- No count on a `?test` page, in an automated browser or in a browser left out with `?plays=off` (open `https://bclark10121-cloud.github.io/?plays=off` once, and `?plays=on` to undo it).
- If Abacus is down, the counts hide and the rest of the page works as before.
- A new game needs nothing extra: its card gets a count from its `data-repo`, and its page gets the script from `build_page.py` (kit 1.26.0).

## Order of the list

Cards in the grid show in order of their Updated stamp, newest first. The page sorts them when it loads, so a new card can go anywhere in `index.html`. Keep the `<time datetime="...">` value correct on every release, since it drives the order.

The version on each card fills itself in from the game page's version line (G1.8 in the standards). No edit is needed here when a game ships a new version.

## Install as an app

Chrome on Android offers Install as well as Create shortcut for this page (BC, 2026-11-25). Three pieces make that work:

- `manifest.webmanifest` at the root: the name, the start page, the standalone display and the page colors.
- `icons/icon-192.png` and `icons/icon-512.png`: the app icon. The art sits in the middle 60 percent so Android's round mask does not clip it.
- One `<link rel="manifest">` line in the head of `index.html`.

There is no service worker, so the installed shelf still needs a connection. To change the icon, replace the two PNG files at the same sizes and names.

This repo holds no game code, no key and no password. The play counter needs no key.
