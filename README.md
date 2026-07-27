# Vova Birthday Card Project Info

## Overview

This project is a Vite-based interactive birthday card for Vova. It opens as a stylized gift/card scene with a dark automotive party background, then reveals a personalized birthday message with animations, confetti, sparkles, balloons, and optional music.

The project is designed as a single-page experience. Most visible text is driven from one config object, so the message can be changed without rewriting the UI logic.

## Tech Stack

- Vite 6 for local development and production builds
- Native HTML, CSS, and JavaScript modules
- Canvas-based animation for confetti and sparkles
- Web Audio API for the built-in melody

## Project Purpose

The app is a celebratory interactive greeting card. It is meant to:

- show a personalized birthday cover for Vova
- open into a message panel with wishes and a signature
- add festive motion through confetti, sparkles, and balloons
- provide replay, gift, and music interactions
- support keyboard shortcuts and reduced-motion preferences

## Main Files

- [index.html](index.html) defines the page structure, buttons, canvases, and card markup
- [src/main.js](src/main.js) wires the UI, loads config, and handles user interaction
- [src/config.js](src/config.js) stores the personalized text content
- [src/confetti.js](src/confetti.js) renders confetti bursts and the continuous confetti effect
- [src/sparkles.js](src/sparkles.js) renders cursor-follow sparkle particles
- [src/balloons.js](src/balloons.js) spawns floating balloons after the card opens
- [src/music.js](src/music.js) plays and stops the birthday melody
- [src/styles.css](src/styles.css) contains the full visual design and animation system
- [assets/cars-party-bg.png](assets/cars-party-bg.png) is the main background image

## Scripts

From [package.json](package.json):

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` serves the built output locally

## Page Structure

The page is centered around the main scene in [index.html](index.html):

- a fixed background image and lighting layers
- a card element with a closed cover and an inside panel
- two canvas layers for confetti and sparkles
- a balloon container for floating balloon elements
- a gift button in the bottom-right corner
- a music toggle in the top-right corner

The card has two visual states:

- closed: shows the birthday cover and the open button text
- open: flips the cover away and reveals the inside message, wishes, signature, replay button, and wish counter

## Runtime Flow

The application starts in [src/main.js](src/main.js) on `DOMContentLoaded`.

1. It applies the values from [src/config.js](src/config.js) into the document title and the visible text nodes.
2. It initializes the confetti canvas, sparkle canvas, and balloon container.
3. It registers click and keyboard handlers.
4. If the page URL contains `?open=1`, the card auto-opens after a short delay.

### Opening the Card

When the user clicks the cover, presses `Space`, or triggers the gift box flow, the app:

- marks the card as open
- starts continuous confetti for a limited time
- reveals the wishes one by one with staggered delays
- triggers burst confetti around each wish as it appears
- starts balloon spawning after a short delay

### Replay Flow

The replay button resets the card state by:

- closing the card again
- clearing revealed wishes
- removing balloons
- stopping confetti
- reopening the card after a short pause

### Gift Box Flow

The gift button creates a large confetti burst around the gift icon, plays a short gift-open animation, hides the gift after the animation completes, and opens the card if it is still closed.

### Music Flow

The music toggle switches the Web Audio melody on and off. The icon and aria label are updated to reflect the current playback state.

## Configuration Data

The message content lives in [src/config.js](src/config.js). Current fields are:

- `name`: recipient name
- `closedTitle`: cover title
- `closedSubtitle`: short subtitle on the cover
- `openButton`: label shown on the cover button
- `headline`: main birthday headline inside the card
- `lead`: opening greeting paragraph
- `wishes`: list of birthday wishes shown as revealed items
- `signature`: closing message
- `replayButton`: label for the replay button

Because [src/main.js](src/main.js) reads these values directly, editing the config is the fastest way to personalize the card.

## Animation Systems

### Confetti

[src/confetti.js](src/confetti.js) uses a canvas to draw small rotating pieces with randomized color, drift, gravity, and spin. It supports:

- a continuous confetti rain effect when the card opens
- point-based bursts from the gift button and wish reveals
- automatic cleanup after the effect duration ends

### Sparkles

[src/sparkles.js](src/sparkles.js) listens to mouse and touch movement and leaves a trail of small star-like sparkles. The effect stops when the pointer leaves the page or when motion is reduced.

### Balloons

[src/balloons.js](src/balloons.js) spawns floating balloon elements at intervals after the card opens. Balloon count and spawn rate adapt to mobile width, and the animation stops automatically after a fixed period.

### Background Motion

[src/styles.css](src/styles.css) adds additional motion with:

- a slow zooming background image
- animated speed lines behind the card
- a pulsing gift button
- a shining card cover highlight
- a 3D flip transition for the open card

## Interaction Controls

Supported actions in [src/main.js](src/main.js):

- click the card cover to open it
- click the replay button to reset and reopen the card
- click the gift box to trigger the gift animation and open flow
- click the music button to toggle melody playback
- press `O` to open the card
- press `R` to replay it
- press `C` to burst confetti at the center of the screen
- press `M` to toggle music
- press `Space` to open the card

## Accessibility And Motion

The project includes several accessibility-aware behaviors:

- `lang="ru"` is set on the document
- the main scene has an aria label
- canvases and decorative layers are marked `aria-hidden="true"`
- the open card area behaves like a button and carries an aria label
- the music toggle updates its aria label when playback changes
- `prefers-reduced-motion: reduce` disables the animated effects and shortens transitions

## Styling Notes

The visual identity is a premium birthday-card look with a dark cinematic background, gold accents, and warm paper tones inside the card. Typography is intentionally mixed between sans-serif UI text and serif display text to make the cover and headline feel more ceremonial.

## Data Summary

At a high level, the project contains:

- 1 HTML entry point
- 1 config file for all personalized copy
- 5 JavaScript modules for behavior and effects
- 1 main stylesheet for layout, animation, and responsive behavior
- 1 background asset image

## Notes

- The existing repository already contains an empty [EXPLANATION.md](EXPLANATION.md), but this project info was written into [Explaine.md](Explaine.md) as requested.
- If you want, this document can also be translated into Russian or expanded into a README-style version.
