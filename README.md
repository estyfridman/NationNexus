# Country Management

## Overview

A full-stack application for managing states and cities using MongoDB, Express.js, React and Node.

### Technologies

- Backend: Node.js, Express.js, MongoDB, Mongoose

- Frontend: React, React Query, Recoil, MUI

- Authentication: JWT

## Setup

### Clone the Repository

```sh
git clone https://github.com/your-repo/state-mng-project.git
cd state-mng-project
```

### Backend Setup

```sh
cd server
npm install
```

#### Environment Variables

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

#### Run Backend

```sh
npm run dev
```

### Frontend Setup

```sh
cd ../client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

