# Restaurant Reservations

A React restaurant website with account registration, sign-in, and a table-reservation form backed by Firebase.

[Existing demo link](https://restaurant-website-h93f0xaop-rkodirkhonovs-projects.vercel.app/) · [Source](https://github.com/rkodirkhonov/restaurant)

## Current functionality

- Restaurant landing page with menu, gallery, chef, and location sections.
- Authentication pages and a protected `/book-table` route.
- Reservation details saved to Firestore.
- Booking history filtered by the signed-in user's ID.

This is a portfolio project in development. The current form records reservation requests; it does not implement table capacity, availability, or conflict prevention.

## Technology

React 18, React Router 6, Firebase Authentication, Cloud Firestore, React Icons, and CSS. The build tooling is Create React App (`react-scripts`), not Vite.

## Run locally

```bash
git clone https://github.com/rkodirkhonov/restaurant.git
cd restaurant
npm ci
```

Before using authentication or reservations:

1. Create a Firebase project for your own development.
2. Replace the web app configuration in `src/firebase.js` with your project's configuration. The current implementation reads this object directly; it does not read `VITE_*` variables.
3. Enable Email/Password authentication and create a Firestore database.
4. Configure authorized domains and Firestore rules for your environment. Users should only read and create bookings associated with their own authenticated UID. Client-side filtering and protected routes alone do not enforce database access.
5. The booking-history query filters by `uid` and orders by `createdAt`; create the corresponding index if Firestore requests it.

```bash
npm start
```

Open the local URL printed by the development server, normally `http://localhost:3000`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the development server |
| `npm run build` | Create a production build |
| `npm test` | Start the configured test runner |

The test command exists in the package configuration; the repository does not currently include application test files. There are no dedicated lint or format scripts.

## Code map

- `src/App.js` — page routes and landing-page composition.
- `src/components/` — shared interface components.
- `src/container/` — landing-page sections.
- `src/pages/` — authentication and booking screens.
- `src/context/` — authentication context and protected-route component.
- `src/firebase.js` — Firebase initialization.

## Next milestones

- [ ] Add visible loading, empty, success, and error states for bookings.
- [ ] Add labels, keyboard checks, and accessible validation messages.
- [ ] Document and test Firestore access rules with an emulator.
- [ ] Add availability and capacity checks before calling a booking confirmed.
- [ ] Add automated tests for authentication and reservation flows.
- [ ] Add a verified walkthrough and screenshots of the complete booking journey.

## Project status

The demo URL above is retained from the existing documentation; availability has not been revalidated in this documentation update. No license file is currently included in the repository.
