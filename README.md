# 🛍️ E-Shop: Production-Grade MERN E-Commerce Store with AI Chatbot

A production-ready e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring role-based authentication, a robust cart system, checkout processes, an admin product dashboard with bulk XLSX/CSV upload, and an intelligent AI Store Assistant.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Redux Toolkit (state management), React Router 6 (routing), Tailwind CSS 3 (styling), Axios (API client), Vite (bundler)
- **Backend**: Node.js, Express.js (REST API framework)
- **Database**: MongoDB (Mongoose ORM)
- **AI Service**: Google Gemini API (`@google/generative-ai`)
- **Parsing**: `xlsx` (Excel sheets processing), `papaparse` (CSV stream parsing)

---

## ✨ Features Implemented

### 1. User Roles & Authentication
- **Secure Hashing**: Password hashing using `bcryptjs` before storage.
- **JWT Authentication**: Secure JSON Web Tokens with client-side header synchronization.
- **Role-Based Access Control**: Route protections on both the frontend and backend levels separating `Admin` and `Customer` privileges.
- **Sample Credentials**:
  - **Admin**: `admin@eshop.com` / `adminpassword123` (Simply register a user with role `admin` or use these details)
  - **Customer**: `customer@eshop.com` / `customerpassword123`

### 2. Storefront Customer Application
- **Product Catalog**: Live loading of products, categorized filtering, and instant search queries.
- **Detailed View**: View product features, stock statuses, and descriptions.
- **Cart System**: Persistent database cart storage ensuring users don't lose items when switching browsers.
- **Order & Checkout**: Full checkout form checking address details, live total, and stock reserves validation.

### 3. Admin Control Center
- **Tabular CRUD**: Create, edit, view, and delete products easily.
- **Order Overviews**: Monitor customer purchases, total amounts, and adjust logistics states (pending, shipped, delivered).
- **Graceful Bulk Upload**: Drag and drop CSV or Excel files. Safe validation process saves valid entries while logging line-by-line mismatch errors gracefully.

### 4. AI Store Assistant (Chatbot)
- **Intelligent Database Queries**: Directly queries the MongoDB database for stock checks, price lists, categories, and descriptions.
- **Personalized Tracking**: If the user is logged in, the AI securely scans order logs to track their shipping statuses.
- **Offline Fallback**: If the Gemini API is unconfigured or rate limits apply, the chatbot degrades gracefully to a friendly fallback responder without breaking functionality.

---

## 🛠️ Step-by-Step Installation & Setup

Ensure you have **Node.js (v16+)** and **MongoDB** installed locally.

### Step 1: Clone and Extract the Project
Open your terminal in the root project folder.

### Step 2: Configure Environment Variables
Inside the `backend/` directory, create a `.env` file (or copy from `.env.example`):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/roam_myway
JWT_SECRET=roam_myway_super_secret_key_1234567890_extremely_secure
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```
*(Replace `your_gemini_api_key_here` with a real Gemini key to enable live AI chatbot conversations!)*

---

## 🚀 Running the Platform

To launch both systems simultaneously, run each in its respective folder:

### 1. Launch the Backend Server
```bash
cd backend
npm install
npm run dev
```
*(The server starts on `http://localhost:5000`)*

### 2. Launch the React Storefront
```bash
cd frontend
npm install
npm run dev
```
*(Vite launches the storefront on `http://localhost:5173`)*

---

## 🗺️ Key Endpoints Mapping

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate
- `GET /api/auth/me` - Profile overview

### Product CRUD & Upload
- `GET /api/products` - Filterable paginated list
- `POST /api/products` - New item (admin)
- `POST /api/products/bulk-upload` - Excel/CSV parser (admin)

### Orders & Logistics
- `POST /api/orders` - Complete checkout
- `GET /api/orders/user/orders` - Customer history
- `GET /api/orders` - Master dashboard (admin)

### Chat
- `POST /api/chat/message` - Intent-parsed assistant responder
