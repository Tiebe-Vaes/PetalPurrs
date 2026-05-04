# PetalPurrs

A cozy tea-shop game where you serve orders to cat customers. Read each cat's request, brew the right tea with the right cup, temperature, and extras, then serve it to earn coins and tips. Level up to unlock new cups and rarer tea types. Don't forget to manage your garden to keep your stock of tea leaves full!

## Technologies Used

- **HTML5:** Core structure of the application.
- **CSS3:** Custom styling for the cozy interface and smooth animations.
- **React (18.3):** Handles state management, UI components, and game logic (loaded directly via CDN).
- **Babel (Standalone):** Compiles JSX syntax directly in the browser, running the game without needing a build step.

## How to play

1. A cat walks in and tells you what they want in their speech bubble
2. Select their order from the queue on the left
3. In the brew screen, pick the correct **tea**, **cup**, **temperature** (iced / warm / hot), and any **extras** they asked for
4. Hit **Serve** — a perfect match earns their tip on top of the base coins
5. Work through the queue, level up, and unlock new cups and blends

## Start the game

```bash
npx serve .
```

Then open `http://localhost:3000` in your browser.

Or just double-click `index.html` to open it directly — no install needed.
