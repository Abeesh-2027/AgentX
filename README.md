# 🤖 AgentX

**AgentX** is a voice-and-text AI agent console that lets users interact with an AI assistant through **text or voice** and perform real-time browser actions using natural language.

You can chat with the AI, speak commands through your microphone, search Google, get directions, and fetch live news — all from a single responsive interface.
---

**Note** 

  This project is created using the help of claude to learn and create a innovation in chatbots
---
## Screenshot

## Login Page

![image alt](https://github.com/Abeesh-2027/AgentX/blob/1c3b6e8f9964de31f22d24976f99a356628c3e85/Screenshot%202026-08-20%20164256.png)

## Interface

![image alt](https://github.com/Abeesh-2027/AgentX/blob/6b99f41bedb9503219e621cf6ba26fbceb4cef64/Screenshot%202026-08-20%20164231.png)

---
## ✨ Features

### 💬 AI Chat

Chat with an AI assistant powered by **Groq** using the `openai/gpt-oss-120b` model.

* Natural-language conversations
* Fast AI responses
* Text-based interaction
* Backend-powered AI requests

### 🎙️ Voice-to-Voice Interaction

AgentX supports voice interaction using built-in browser APIs.

* 🎤 Speech recognition for microphone input
* 🔊 Speech synthesis for spoken responses
* No separate speech API required
* Works on supported browsers
* Best experience on Chrome and Edge

### 🔎 Google Search Commands

AgentX understands commands such as:

```text
search apple in google
```

It automatically opens:

```text
https://www.google.com/search?q=apple
```

The search is performed directly by the user's browser rather than through a search API.

### 🗺️ Google Maps Directions

You can give location-based commands such as:

```text
go from here to eiffel tower
```

AgentX requests the device's GPS location and opens Google Maps with directions from the current location to the requested destination.

Example:

```text
go from here to central park
```

### 📰 Live News

Ask AgentX for current headlines:

```text
news about ai
```

```text
news about space
```

The application retrieves headlines from **Google News RSS**, so no separate news API key is required.

### 🔐 Demo Authentication

AgentX includes a simple login system using JWT sessions.

* Username can be any non-empty value
* Password must be exactly **5 digits**
* JWT is used to maintain the session
* Designed as a demonstration authentication system

> **Note:** This authentication system is intentionally minimal and is not intended to replace a production user-management system.

### 📱 Responsive Interface

The interface is designed to work across different screen sizes.

* Desktop
* Laptop
* Tablet
* Mobile devices

---

## 🏗️ Architecture

AgentX follows a simple **frontend + backend** architecture.

```text
                    ┌─────────────────────┐
                    │       AgentX        │
                    │   React + Vite UI   │
                    └──────────┬──────────┘
                               │
                               │ API Requests
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │   Node + Express    │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
          ┌──────────────┐           ┌──────────────┐
          │     Groq     │           │ Google News  │
          │      AI      │           │     RSS      │
          └──────────────┘           └──────────────┘

Browser-side actions:

Google Search ───────────────► Google
Google Maps   ───────────────► Google Maps
GPS Location  ───────────────► Device Browser
Speech Input  ───────────────► Web Speech API
Speech Output ───────────────► Speech Synthesis API
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3
* Web Speech API
* Speech Synthesis API

### Backend

* Node.js
* Express.js
* JWT
* REST API

### AI

* Groq API
* `openai/gpt-oss-120b`

### External Services

* Google Search
* Google Maps
* Google News RSS
* Browser Geolocation API

---

## 📂 Project Structure

```text
AgentX/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── render.yaml
│   └── .env.example
│
└── README.md
```

> The exact internal file structure may vary depending on the current version of the project.

---

## ⚙️ How AgentX Works

AgentX acts as an intelligent command router.

When a user enters or speaks a command, the application determines what type of action is required.

### AI Conversation

```text
User
 │
 ▼
AgentX
 │
 ▼
Backend API
 │
 ▼
Groq
 │
 ▼
AI Response
 │
 ▼
AgentX
```

### Google Search

```text
"search apple in google"
            │
            ▼
      Detect search command
            │
            ▼
      Create Google URL
            │
            ▼
       Open new tab
```

### Google Maps

```text
"go from here to Eiffel Tower"
              │
              ▼
      Request GPS permission
              │
              ▼
       Get current location
              │
              ▼
     Create Maps directions URL
              │
              ▼
       Open Google Maps
```

### News

```text
"news about AI"
       │
       ▼
Backend
       │
       ▼
Google News RSS
       │
       ▼
Latest headlines
       │
       ▼
AgentX interface
```

---

## 🎙️ Voice Processing

AgentX uses browser-native speech technologies.

### Speech Recognition

The browser's `SpeechRecognition` API converts microphone input into text.

```text
🎤 User speaks
      ↓
SpeechRecognition
      ↓
Text command
      ↓
AgentX command router
```

### Speech Synthesis

AI responses can be spoken back to the user using the browser's `speechSynthesis` API.

```text
AI response
     ↓
speechSynthesis
     ↓
🔊 Spoken response
```

This allows AgentX to provide a voice-assistant-like experience without requiring a dedicated speech processing server.

---

## 🔑 Environment Variables

The backend uses environment variables for configuration.

Example:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
JWT_SECRET=your_long_random_secret
ALLOWED_ORIGINS=http://localhost:5173
```

The frontend uses:

```env
VITE_API_URL=http://localhost:8080
```

**Never commit real API keys or secrets to GitHub.**

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AgentX
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:8080
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the frontend in your browser and start using AgentX.

---

## 🧪 Example Commands

Try commands like:

```text
Hello AgentX
```

```text
What is artificial intelligence?
```

```text
search apple in google
```

```text
search latest AI tools in google
```

```text
go from here to Eiffel Tower
```

```text
go from here to Central Park
```

```text
news about AI
```

```text
news about space
```

You can also simply press the **microphone button** and speak naturally.

---

## 🔐 Authentication

AgentX uses a lightweight demo authentication flow.

Example:

```text
Username: abe
Password: 42017
```

The username can be any non-empty value, while the password must contain exactly five digits.

This is intended for demonstrating session-based authentication rather than providing a complete production identity system.

---

## 🎯 Project Goals

AgentX was designed to demonstrate how multiple modern web technologies can work together to create an interactive AI application.

The project combines:

* AI-powered conversations
* Voice recognition
* Voice responses
* Natural-language command routing
* Browser automation
* Geolocation
* Google Search integration
* Google Maps integration
* Live news retrieval
* JWT authentication
* Responsive web design

The goal is to create a simple **AI agent console** where users can interact with an assistant naturally instead of relying only on traditional buttons and menus.

---

## 💡 Why AgentX?

Traditional web applications usually require users to navigate menus and click buttons to perform actions.

AgentX takes a different approach:

```text
Traditional App
     ↓
Find feature
     ↓
Click button
     ↓
Enter information
     ↓
Perform action
```

With AgentX:

```text
Tell AgentX what you want
           ↓
    AgentX understands
           ↓
      Performs action
```

For example:

> **"Search Apple in Google."**

Instead of manually opening Google and typing the search, AgentX understands the command and performs the browser action.

---

## ⚠️ Limitations

AgentX is primarily a **portfolio and demonstration project**.

Some features depend on browser support:

* Speech recognition requires a compatible browser
* Speech synthesis depends on browser/device support
* GPS features require location permission
* Google Search and Maps require a browser capable of opening external URLs
* Authentication is intentionally minimal
* News availability depends on the Google News RSS feed

---

## 🔮 Future Improvements

Possible future enhancements include:

* Real user accounts
* Database-backed authentication
* Conversation history
* Persistent chat sessions
* More AI models
* Custom voice selection
* Better natural-language command detection
* Weather commands
* Calendar integration
* Email integration
* Task and reminder management
* More browser actions
* AI tool/function calling
* User-specific preferences

---

## 📜 License

This project is created for educational and portfolio purposes.

---

## 👨‍💻 Author

**Abeesh**

Built as a full-stack AI agent project combining **React, Node.js, Groq, browser APIs, Google services, and natural-language interaction**.
