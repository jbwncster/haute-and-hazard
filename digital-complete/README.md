# Haute & Hazard — Complete Web / Android App

This responsive, installable web app uses the canonical v7.9 card and Stage data from `digital-playtest/data.js` and supports both:

- **Standard game:** 2–5 players in local hot-seat play.
- **Solo Circuit v0.2:** one player against the House Automa, with difficulty and Personality choices.

The setup offers Beginner Mode and Full Stage Rules. Save data stays in the browser on the device; the service worker caches the app and card data for offline play after the first successful load. On Android, open the site in a supported browser and use its **Install app** or **Add to Home screen** action.

## Run locally

Serve the repository root so the app can load the shared card data:

```bash
python -m http.server 8080
```

Open `http://localhost:8080/digital-complete/`.

## Rules handling

Core timing, starting decks, shared market, Wardrobe Rack refill, Look multipliers, Stage scoring, Curtain Call, Solo House Appeal, Automa effects, and final scoring follow the current v7.9 / Solo v0.2 references. When an effect needs a physical choice or cannot be inferred safely, the app opens Guided Manual Resolution and keeps the card text visible.

See [`RULES_COMPATIBILITY.md`](RULES_COMPATIBILITY.md) for documented source assumptions. This is a browser app that can be installed on Android; it is not a native Play Store package.
