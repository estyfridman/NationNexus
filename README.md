# NationNexus

## Overview

A full-stack application for managing states and cities using MongoDB, Express.js, React and Node.

### Technologies

- Backend: Node.js, Express.js, MongoDB, Mongoose

- Frontend: React, React Query, Recoil, MUI

- Authentication: JWT

## Setup

### Clone the Repository

```sh
git clone https://github.com/estyfridman/NationNexus.git
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
PORT=your_port
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_mail
EMAIL_PASS=your_mail_password
FRONTEND_URL=your_frontend_url
```

#### Run Backend

```sh
npm run dev
```

### Frontend Setup

```sh
cd ../client
npm install
```

#### 8. Create .env file and fill up the credentials (still inside client folder).

```
VITE_API_PORT=your_vite_app_port
```

```sh
npm run dev
```

Open `http://localhost:5173` in your browser.
