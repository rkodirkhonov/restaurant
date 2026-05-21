# Restaurant Reservation Website

A modern, responsive React application for a restaurant landing page with user
authentication and a Firestore-backed table reservation system.

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [License](#license)
- [Contact](#contact)

## Features
- User authentication (Register / Login / Logout) via Firebase Auth
- Protected routes for signed-in users
- Table reservation form persisted to Cloud Firestore
- Per-user booking history
- Fully responsive landing page (gallery, menu, awards, contact)

## Demo
- Live demo: https://restaurant-website-h93f0xaop-rkodirkhonovs-projects.vercel.app/
- GitHub: https://github.com/rkodirkhonov/restaurant

## Tech Stack
- React 18 (Create React App)
- React Router v6
- Firebase Authentication and Cloud Firestore
- React Icons
- Plain CSS

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/rkodirkhonov/restaurant.git
   cd restaurant
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and fill in your Firebase project credentials:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The app runs at http://localhost:3000.

## Environment Variables

Create a `.env` file in the project root with the following keys (see
`.env.example`):

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Available Scripts
- `npm start` — Runs the app in development mode.
- `npm run build` — Builds the app for production into `build/`.
- `npm test` — Runs the test runner in watch mode.

## Project Structure
```
src/
├── App.js                 # Routes
├── index.js               # App entrypoint + providers
├── firebase.js            # Firebase initialization
├── assets/                # Images and media
├── components/            # Reusable UI (Navbar, Footer pieces, MenuItem, SubHeading)
├── container/             # Page sections (Header, AboutUs, Menu, Chef, ...)
├── constants/             # Static data and image map
├── context/               # Auth context + ProtectedRoute
└── pages/                 # Auth and booking screens
```

## License
Distributed under the MIT License.

## Contact
**Author:** RusDev — https://github.com/rkodirkhonov
**Email:** kodirkhonov99@gmail.com
