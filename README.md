# CrApp 💩 (an app to use on the toilet)

- You look at this app on the toilet *instead* of social media/news
- Unlike a game, stop whenever
- Has a streak feature to encourage continued use
- A streak leaderboard but it is anonymised, you don't want "friends" on this app
- you just look at the screen and tap circles, is no point, it is not a game, but... there are easter eggs!
- the circles are sometimes emojis, or sometimes themed icons, christmas etc, depending on the day
- alternatively, maybe there is some kind of swipe or scroll
- long term vision: high userbase, advertisers pay for their icons to appear
- billions of users, captured every morning or whenever they shit
- also should work without disruption when no internet
- needs close to zero loading time

## How to Run Locally

1. Make sure you have Node.js installed.
2. In the project root, run `npm install` to install the dependencies.
3. Run `npm run dev` to start the development server.
4. Open the `localhost` URL provided in the terminal to view the application in your browser.

##  Project Structure & Setup

- React + Vite: Initialized the project with Vanilla React using Vite for the fastest loading times.
- Progressive Web App: Configured vite-plugin-pwa so the app is installable on mobile devices and functions completely offline without internet disruption.
- Icons: Generated a premium custom app icon using my image tool and placed it within public/crapp_app_icon.png so it handles the device installation manifest properly.

## Core Features Implemented

### Bubble Wrap Mechanic
Located in App.jsx.

- The main area displays numerous bubbles with varying sizes, hues, and slight animation delays for an organic, relaxing aesthetic.
- Clicking/tapping a bubble "pops" it, causing it to scale to 0 (transform: scale(0)).
- Easter Eggs: Each bubble has a 15% chance to hide a secret emoji which is smoothly revealed when popped.
- The bubbles regenerate dynamically after random intervals, so you can stop playing whenever.

### Streak Tracking System
Implemented via localStorage, so the user's login date and count are persisted across sessions without a backend.
Located within a React useEffect inside App.jsx, checking the date against lastLogin.

### Mock Anonymous Leaderboard
Used a daily seeded random number generator directly inside React so the anonymized leaderboard scores update procedurally without actual user data.

### Aesthetics
Built utilizing Vanilla CSS through index.css and App.css.

- Utilized a deeply saturated, modern dark theme: #0f172a (slate-900) as the foundation with radial gradient highlights.
- Implemented Glassmorphism for the top header and bottom leaderboard, using backdrop-filter: blur(16px) combined with subtle translucent borders.
- Micro-animations: Appplied custom cubic-bezier transitions to the bubble clicks to create a "bouncy" premium tactile feel.