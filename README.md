# Cards Against Humanity

This repository contains a clone of the famous game **Cards Against Humanity**, implemented as a web project using **NestJS**, **React**, **Socket.IO**, and **TailwindCSS**. The goal of this project is to recreate the original game experience, allowing friends to play together online.

## 🎮 Features

- **Fixed Room:** There is only one fixed room for all players.
- **Game Start:** Once the game starts, new players cannot join until the current game is finished.
- **Game End and Reset:** After the game ends, the room state is reset, allowing new players to join and a new game to begin.

## 🚀 Technologies Used

- **[NestJS](https://nestjs.com/)**
- **[React](https://reactjs.org/)**
- **[Socket.IO](https://socket.io/)**
- **[TailwindCSS](https://tailwindcss.com/)**

## 🛠️ Installation and Setup

### Installation
After cloning this repository, simply navigate to the __server__ and __app__ subfolders, install dependencies, and run the services:
```bash
cd ./server
npm install && npm run start:dev

cd ./app
npm install && npm run dev

```

### Configuration
There is only one configuration required in the app folder, which is the creation of a .env file where you should specify the socket server URL:
```env
VITE_SOCKET_URL = http://localhost:3000
```

### Access
To access the application, simply visit [http://localhost:5173](http://localhost:5173)
