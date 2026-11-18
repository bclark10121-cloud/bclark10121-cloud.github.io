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

## Order of the list

Cards in the grid show in order of their Updated stamp, newest first. The page sorts them when it loads, so a new card can go anywhere in `index.html`. Keep the `<time datetime="...">` value correct on every release, since it drives the order.

The version on each card fills itself in from the game page's version line (G1.8 in the standards). No edit is needed here when a game ships a new version.

This repo holds no game code, no key and no password.
