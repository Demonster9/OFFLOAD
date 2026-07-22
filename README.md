<div align="center">

# OFFLOAD

### Anonymous Collaboration Platform for Developers

```text
 ██████╗ ███████╗███████╗██╗      ██████╗  █████╗ ██████╗
██╔═══██╗██╔════╝██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗
██║   ██║█████╗  █████╗  ██║     ██║   ██║███████║██║  ██║
██║   ██║██╔══╝  ██╔══╝  ██║     ██║   ██║██╔══██║██║  ██║
╚██████╔╝██║     ██║     ███████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝ ╚═╝     ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝
```

### 🚀 Connect • Collaborate • Share • Stay Anonymous

**A real-time platform where developers collaborate anonymously through intelligent matchmaking and live discussions.**

<br>

🌐 **Live Demo**  
https://offload-mu.vercel.app

</div>

---

# 📖 About OFFLOAD

OFFLOAD is a real-time anonymous collaboration platform designed exclusively for developers.

Whether you're looking for career advice, discussing technical challenges, brainstorming new ideas, or simply connecting with fellow developers, OFFLOAD provides a distraction-free environment where conversations happen without revealing personal identity.

Unlike traditional chat applications, OFFLOAD intelligently matches developers into discussion rooms and enables seamless real-time communication powered by Socket.IO.

---

# ✨ Key Features

### 🔐 Authentication

- Anonymous Developer Login
- GitHub OAuth Authentication
- JWT Authentication
- Secure Sessions

---

### 💬 Real-Time Collaboration

- Live Developer Chat
- Socket.IO Communication
- Real-Time Participant Updates
- Instant Room Synchronization

---

### 🤝 Smart Matchmaking

- Automatic Room Matching
- Up to 6 Developers per Room
- Intelligent Waiting Room
- Countdown Based Room Start
- Dynamic Room Allocation

---

### 👤 Developer Profiles

- Custom Handle
- Experience Level
- Tech Stack
- Bio
- Skills
- Portfolio
- GitHub Username

---

### 🛡 Security

- Protected API Routes
- Helmet Security
- JWT Authorization
- MongoDB Validation

---

# 🛠 Tech Stack

| Frontend | Backend | Database | Deployment |
|----------|----------|----------|------------|
| React.js | Node.js | MongoDB Atlas | Vercel |
| React Router | Express.js | Mongoose | Render |
| Axios | Socket.IO | | |
| CSS | Passport.js | | |
| React Icons | JWT | | |

---

# 🏗 Architecture

```text
                React Frontend
                      │
                      │
                  Axios + JWT
                      │
                      ▼
              Express REST API
                      │
        ┌─────────────┴─────────────┐
        │                           │
   Socket.IO Server           Passport.js
        │                           │
        └─────────────┬─────────────┘
                      │
                 MongoDB Atlas
```

---

# 🚀 Core Workflow

```text
Developer Login
        │
        ▼
Authentication
        │
        ▼
Profile Setup
        │
        ▼
Smart Matchmaking
        │
        ▼
Waiting Room
        │
        ▼
Countdown Starts
        │
        ▼
Room Activated
        │
        ▼
Real-Time Discussion
```

---

# 📂 Project Structure

```text
OFFLOAD
│
├── client
│   ├── public
│   ├── src
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── matching
│   ├── models
│   ├── routes
│   ├── services
│   ├── socket
│   └── server.js
│
├── assets
├── README.md
└── LICENSE
```

---

# 🌟 Highlights

✔ GitHub OAuth Authentication

✔ Anonymous Authentication

✔ JWT Based Authorization

✔ Real-Time Socket.IO Chat

✔ Intelligent Matchmaking System

✔ Dynamic Room Allocation

✔ Countdown Based Room Creation

✔ MongoDB Atlas Integration

✔ Fully Responsive Design

✔ Cloud Deployment (Render + Vercel)

---

# 📸 Screenshots

> Screenshots will be added here.

- Login Page
- Waiting Room
- Chat Room
- Developer Profile
- GitHub Authentication

---

# 🚀 Challenges Solved

During the development of OFFLOAD, several real-world engineering challenges were addressed:

- Implemented secure GitHub OAuth authentication.
- Built a scalable room matching system for developers.
- Designed a countdown-based waiting room workflow.
- Managed real-time communication using Socket.IO.
- Deployed frontend and backend on separate cloud platforms.
- Handled JWT authentication across REST APIs and Socket.IO connections.
- Optimized room creation and participant synchronization.

---

# 🔮 Future Roadmap

- Voice Collaboration
- Video Rooms
- AI Ice Breakers
- Friend System
- Notifications
- Room History
- Admin Dashboard
- Mobile Application

---

# 👨‍💻 Developer

**Dhananjay Tangade**

B.Tech Information Technology  
Government College of Engineering, Karad

GitHub

https://github.com/Demonster9

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a Star!

Made with ❤️ using React, Node.js, Express, MongoDB & Socket.IO

</div>
