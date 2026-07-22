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

### 🚀 Connect • Collaborate • Code • Anonymous

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)]()

### 🌐 Live Demo

**Frontend:** https://offload-mu.vercel.app

**Backend:** https://offload-api-mbp1.onrender.com

</div>

---

# 📖 Overview

OFFLOAD is a real-time anonymous collaboration platform built for developers. It enables engineers to connect, share ideas, discuss technical challenges, and collaborate in private, topic-based rooms without revealing their identity.

The platform combines anonymous authentication, GitHub OAuth, intelligent room matching, and real-time messaging using Socket.IO to create a distraction-free environment for meaningful developer conversations.

---

# ✨ Features

## 🔐 Authentication

- Anonymous onboarding
- GitHub OAuth
- JWT Authentication
- Secure Sessions

## 💬 Real-Time Collaboration

- Socket.IO powered messaging
- Live participant synchronization
- Instant room updates
- Countdown-based room activation

## 🤝 Smart Matchmaking

- Automatic room assignment
- Up to 6 developers per room
- Dynamic room creation
- Intelligent waiting room management
- Automatic countdown when enough users join

## 👤 Developer Profiles

- Custom Handle
- Experience Level
- Tech Stack
- Bio
- Skills
- Portfolio
- GitHub Username

## 🛡 Security

- Helmet
- Protected Routes
- JWT Authorization
- MongoDB Validation

---

# 🛠 Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Socket.IO Client
- React Icons
- CSS

### Backend

- Node.js
- Express.js
- Socket.IO
- Passport.js
- JWT
- Express Session

### Database

- MongoDB Atlas
- Mongoose

### Deployment

- Vercel
- Render

---

# 📂 Project Structure

```text
OFFLOAD
│
├── assets/
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── matching/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   └── server.js
│
├── README.md
└── LICENSE
```

---

# 🚀 Installation

```bash
git clone https://github.com/Demonster9/OFFLOAD.git

cd OFFLOAD
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

---

# ⚙ Environment Variables

### Client

```env
REACT_APP_API_URL=http://localhost:5000
```

### Server

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
SESSION_SECRET=YOUR_SECRET
CLIENT_URL=http://localhost:3000
GITHUB_CLIENT_ID=YOUR_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

---

# 📡 API

## Authentication

```
POST /api/auth/register
POST /api/auth/onboarding
GET  /api/auth/me
PUT  /api/auth/profile
GET  /api/auth/github
```

## Profile

```
GET   /api/profile/me
PATCH /api/profile
GET   /api/profile/:id
```

## Rooms

```
POST /api/rooms/join
GET  /api/rooms/:id
POST /api/rooms/:id/close
```

---

# ⚡ Socket Events

### Client

- join_room
- leave_room
- send_message
- typing

### Server

- room_joined
- participant_joined
- participant_left
- receive_message
- room_started
- countdown
- room_closed

---

# 🎯 Matching Algorithm

- Maximum 6 participants per room.
- New users always join the oldest waiting room.
- When a room reaches 6 participants, it starts immediately.
- When at least 2 users are waiting, a countdown begins.
- Users joining during the countdown are added to the same room.
- Once a room starts, new users are placed into a new waiting room.

---

# 🔮 Future Roadmap

- Voice Rooms
- Video Collaboration
- AI Discussion Starters
- Notifications
- Friend System
- Moderation Dashboard
- Mobile Application

---

# 👨‍💻 Author

**Dhananjay Tangade**

Government College of Engineering, Karad

GitHub: https://github.com/Demonster9

---

# 📄 License

MIT License

---

<div align="center">

### ⭐ If you like OFFLOAD, consider giving the repository a star!

Built with ❤️ using React, Node.js, Express, MongoDB & Socket.IO.

</div>
