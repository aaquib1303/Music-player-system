# 🎵 Spotify Clone – Music Streaming Web App

A responsive and interactive web-based music player inspired by Spotify. This project replicates the look and feel of Spotify’s user interface and provides core features like playlist selection, dynamic playbar, volume control, and real-time playback updates using vanilla JavaScript.

## Features

- Playlist browsing (My Library, Nasheeds, Ringtones)
- Play, pause, next, and previous song controls
- Live time & duration updates
- Interactive seek bar with drag support
- Volume slider and mute toggle
- Custom UI with SVG icons and responsive design
- Mobile-friendly layout and hamburger sidebar toggle

## Tech Stack

- HTML5 – Semantic layout structure
- CSS3 – Custom styling and responsive media queries
- JavaScript (Vanilla) – Playback logic, playlist rendering, and DOM interaction
- Git & GitHub Pages – Version control and deployment

## File Structure

Music-player-system/
├── Songs/
│ ├── library/
│ ├── nasheeds/
│ └── ringtones/
├── assets/
│ ├── globe.svg
│ ├── home.svg
│ ├── logo.svg
│ ├── play.svg
│ ├── playbar0.svg
│ ├── playbar1.svg
│ ├── playbar2.svg
│ ├── playbar3.svg
│ ├── muted.svg
│ ├── unmuted.svg
│ ├── search.svg
│ ├── plus.svg
├── index.html
├── script.js
├── style.css
├── utility.css
└── README.md

bash
Copy
Edit

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/aaquib1303/Music-player-system.git
   cd Music-player-system
   
2. Start a local development server:

Using Python (for Python 3):

```bash
python -m http.server
```
Or use the Live Server extension in VS Code.

Open http://localhost:8000 in your browser (recommended for fetch-based playlist loading).

# Notes
For full functionality (like dynamic file fetching using fetch()), you must run the project on a local server. Directly opening index.html may not load playlists correctly.

Ensure all file paths are relative and folder structure is preserved after cloning.
