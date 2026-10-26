# Assemblea Event Admin Panel

## Setup

1. Install Node.js.
2. In the project folder, run `npm run install:all`.
3. Copy `backend/.env.example` to `backend/.env`, then set `MONGODB_URI` to your MongoDB Atlas connection string and `PORT` to `5000`.
4. In MongoDB Atlas, allow your development IP address and create a database user with access to the project database.
5. Run `npm run dev` from the project folder.
6. Open `http://localhost:5173`.

Use a dedicated test database and keep its credentials private. Do not commit `.env` files.
