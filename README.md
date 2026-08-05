# Neon Reels — Demo Slot Arcade

A mobile-first, static slot-game demo inspired by the *layout style* of modern mobile game portals.

## Important

This project is **free-to-play only**:
- Uses virtual demo coins.
- No deposits.
- No withdrawals.
- No payment processing.
- Demo coins have no cash value.

## Run locally

No build tools are required.

```bash
git clone https://github.com/YOUR-USERNAME/neon-reels-demo.git
cd neon-reels-demo
```

Open `index.html` in a browser, or serve the folder with any static server.

Example:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md`.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save. GitHub will publish the static site.

## Customize

Edit `GAMES` in `app.js` to add or change games and symbols. Change the CSS variables at the top of `styles.css` for the theme.

No external libraries or assets are required.
