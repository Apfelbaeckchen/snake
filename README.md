# 🐍 Pixel Snake

Ein klassisches Arcade-Mini-Game mit Pixelgrafik – komplett statisch
(HTML + CSS + JavaScript), ohne Server und ohne Datenbank.
Ideal als erster Schritt, um zu lernen, wie man ein interaktives Spiel
auf dem eigenen Webspace bereitstellt.

## Features

- Canvas-Spielfeld mit niedriger interner Auflösung (240×240), hochskaliert
  mit `image-rendering: pixelated` → echter Pixel-Look
- Retro-Scanline-Effekt und Pixel-Schrift ("Press Start 2P")
- Steuerung per Pfeiltasten / WASD, Leertaste = Pause, Enter = Start
- Touch-Steuerung per Wischen (Smartphone)
- Punkte pro Apfel, das Tempo steigt mit jedem Apfel
- Highscore dauerhaft im Browser gespeichert (`localStorage`)

## Lokal testen

`index.html` direkt im Browser öffnen oder kurz lokal serven:

```bash
cd pixel-snake
python3 -m http.server 8000
# dann aufrufen: http://localhost:8000
```

## Auf dem Webspace hosten

Weil alles statisch ist, genügt das Hochladen:

1. FTP-Programm (z. B. FileZilla) öffnen und mit dem Webspace verbinden.
2. Alle drei Dateien (`index.html`, `style.css`, `game.js`) in ein
   Unterverzeichnis hochladen, z. B. `public_html/snake/`.
3. Fertig – erreichbar unter `https://deine-domain.de/snake/`.

**Hinweis:** `index.html` wird automatisch geladen, wenn man nur das
Verzeichnis aufruft. Die Pixel-Schrift lädt der Browser von Google Fonts;
ohne Internetverbindung fällt er auf eine Standard-Mono-Schrift zurück.

## Kostenlos ohne eigenen Webspace: GitHub Pages

1. Dateien in ein GitHub-Repository legen.
2. **Settings → Pages → Source: Deploy from a branch → Branch `main`, Ordner `/ (root)`**.
3. Nach wenigen Minuten online unter `https://<user>.github.io/<repo>/`.

## Ideen zum Weiterbauen

- Soundeffekte (z. B. „Piep“ beim Fressen) mit der Web Audio API
- Highscore-Tabelle über ein kleines Backend (Firebase/Supabase)
- Verschiedene Level mit Hindernissen
- Eigenes Pixel-Art-Sprite statt Rechtecken (z. B. 8×8-Sprite als Array)
- Mehr Arcade-Klassiker: Pong, Breakout, Flappy Bird – alle funktionieren
  mit dem gleichen Prinzip: eine `index.html`, Canvas + JavaScript, statisch hostbar
