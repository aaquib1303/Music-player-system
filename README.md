
# 🎵 Music Player System

A sleek and responsive web-based music player built using **HTML**, **CSS**, and **JavaScript** — no frameworks, no libraries, just pure frontend magic.

This project mimics a Spotify-style interface with functional playlists, a playbar, responsive controls, and volume adjustment — all done from scratch.

---

##  Features

-  Play music directly from the UI
-  Three categories: Library, Nasheeds, and Ringtones
-  Seekbar and volume control
-  Play, Pause, Next, Previous buttons
-  Playlist selection updates UI
-  Hover effects with SVG icons
-  Fully responsive from large screens to mobile

---


##  File Structure

```
Music-player-system/
│
├── index.html              # Main HTML file
├── style.css               # Main styling
├── utility.css             # Reusable utility classes
├── script.js               # All JavaScript logic
│
├── Songs/                  # All audio files
│   ├── library/            # General songs
│   ├── nasheeds/           # Islamic nasheeds
│   └── ringtones/          # Ringtones
│
└── assets/                 # SVG icons used in UI
    ├── play.svg
    ├── pause.svg
    ├── globe.svg
    ├── plus.svg
    ├── ...
```

The project is organized in a clean modular way for better readability and maintainability.

---

##  Tech Stack

* **HTML5**
* **CSS3** (Flexbox, Media Queries, Custom Utility Classes)
* **JavaScript** (Vanilla JS DOM Manipulation)

---

##  Responsive Design Strategy

* Below **700px**: Album pic + song details wrap
* Below **500px**: Playbar components stack vertically:

  * Song image
  * Song name and artist
  * Controls (play/pause, next, previous)
  * Seekbar
  * Volume control

---




