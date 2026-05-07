# 🧬 Parental Legacy

A full-stack web application that visualizes the deterministic biometric influence of parents based on the day of the month.

## ✨ Features
- **Deterministic Logic:** Same date always produces the same results.
- **Dynamic Dominance:** Mother-dominant on odd days, Father-dominant on even days.
- **API Driven:** React frontend fetches calculations from a Node.js Express backend.
- **Precision:** Mathematical normalization ensures the overall total is always exactly 100.000.

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, CORS

## 🚀 Getting Started

### 1. Install Dependencies
Run this in the root folder:
```bash
npm install

### Start Backend Server

node server.js

### Start Frontend

npm run dev


📂 Project Structure


parental-legacy-app/
├── node_modules/       # Installed dependencies (npm install)
├── public/             # Static assets (icons, favicon)
├── src/                # React Frontend source code
│   ├── assets/         # Images and styles
│   ├── App.jsx         # Main Logic & API fetch logic
│   ├── main.jsx        # React DOM entry point
│   └── index.css       # Tailwind
├── .gitignore          # Files to ignore in Git
├── index.html          # Frontend entry HTML file
├── package.json        # Project metadata and dependencies
├── README.md           # Project documentation
├── server.js           # Node.js Express Backend (Logic & API)
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite build tool configuration