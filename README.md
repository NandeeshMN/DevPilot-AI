# 🚀 DevPilot AI

> **DevPilot AI** is a modern AI-powered software engineering workspace that helps developers debug code, generate code, explain code, write SQL queries, create README files, and chat with AI — all from a single platform.

Built using **React + TypeScript**, **Node.js + Express**, **Firebase**, and **Google Gemini API**, DevPilot AI delivers a premium SaaS-like developer experience.

---

# 📖 Table of Contents

- Features
- Tech Stack
- Architecture
- Project Structure
- Installation
- Environment Variables
- Firebase Setup
- Gemini API Setup
- Brevo Setup
- AI Modules
- Security
- Future Scope
- Author
- License

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Firebase Authentication
- Forgot Password
- OTP Verification
- Password Reset
- Protected Routes

---

## 🤖 AI Chat

- Powered by Google Gemini 2.5 Flash
- Persistent conversation history
- Context-aware responses
- Firestore chat storage
- Automatic conversation title generation
- JWT-protected API endpoints

---

## 🐞 Debug Assistant

- Detect runtime errors
- Generate corrected code
- Explain bug fixes
- Copy corrected code
- AI-powered debugging

---

## 💻 Code Generator

Generate code using natural language prompts.

Supports:

- JavaScript
- TypeScript
- React
- Node.js
- Express
- Python
- Java
- C++
- HTML
- CSS
- SQL

---

## 📖 Explain Code

Understand any code instantly.

Includes:

- Logic Explanation
- Flow Analysis
- Best Practices
- Readability Suggestions

---

## 🗄 SQL Assistant

Generate

- SQL Queries
- Table Joins
- Stored Procedures
- Database Schema
- Query Optimization

---

## 📝 README Generator

Automatically generate

- README.md
- Installation Guide
- Documentation
- Feature List
- Project Overview

---

## 👤 Profile Management

- Editable profile
- Firebase Storage image upload
- Bio
- Member Since
- Last Updated
- Firestore persistence

---

## 🔥 Firebase Integration

- Authentication
- Firestore Database
- Firebase Storage

---

## 📱 Responsive Design

Optimized for

- Desktop
- Tablet
- Mobile

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

---

## Backend

- Node.js
- Express.js
- JWT
- bcrypt
- Firebase Admin SDK
- Google Gemini SDK
- Brevo API

---

## Database

- Firebase Firestore

---

## Storage

- Firebase Storage

---

## AI

- Google Gemini 2.5 Flash

---



# 📂 Project Structure

```
DevPilot-AI
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   ├── context
│   │   ├── services
│   │   ├── hooks
│   │   ├── routes
│   │   ├── utils
│   │   └── types
│   │
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── services
│   ├── utils
│   ├── firebase-service-account.json
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/devpilot-ai.git

cd devpilot-ai
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create

```
backend/.env
```

Add

```env
PORT=5000

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

BREVO_API_KEY=your_brevo_api_key

BREVO_FROM_EMAIL=your_verified_email

BREVO_FROM_NAME=DevPilot AI

FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

Run

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create

```
frontend/.env
```

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run

```bash
npm run dev
```

---

# 🔥 Firebase Setup

Create a Firebase Project.

Enable

- Authentication
- Firestore Database
- Firebase Storage

Download

```
firebase-service-account.json
```

Place inside

```
backend/
```

---

# 🤖 Gemini API Setup

1. Open Google AI Studio

2. Create an API Key

3. Add


---

# 🧠 AI Modules

| Module | Status |
|----------|--------|
| AI Chat | ✅ |
| Debug Assistant | ✅ |
| Explain Code | ✅ |
| Generate Code | ✅ |
| SQL Assistant | ✅ |
| README Generator | ✅ |
| Profile Management | ✅ |
| Authentication | ✅ |

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Firebase Authentication
- Firebase Security Rules
- Protected APIs
- Secure Environment Variables
- OTP Email Verification
- Firestore Access Control

---

# 🚀 Future Enhancements

- ✅ OpenAI Integration
- ✅ Claude Integration
- ✅ Model Selection
- ✅ AI Agent Marketplace
- ✅ Voice Assistant
- ✅ Team Collaboration


---

# 💡 Why DevPilot AI?

Unlike a traditional chatbot, DevPilot AI is designed as an **AI Software Engineering Workspace** where multiple specialized developer tools work together under a unified interface.

It provides:

- AI-powered coding assistance
- Secure authentication
- Persistent chat history
- Professional SaaS UI
- Firebase cloud integration
- Modern developer workflow
- Scalable architecture for adding multiple LLM providers (Gemini, OpenAI, Claude, etc.)

---

# 👨‍💻 Author

**Nandeesh M N**

MCA Graduate • Full Stack Developer • AI Enthusiast

---

# 🙏 Acknowledgements

- Google Gemini API
- Firebase
- Brevo
- React
- Express.js
- Tailwind CSS
- Vite
- TypeScript

---

