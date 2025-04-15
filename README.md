# E-Store

E-Store is a comprehensive e-commerce platform specializing in air conditioners and fans with various sizes and colors.This full-stack application consists of three main components:

- **Customer Frontend**: Browse products, manage cart, and place orders
- **Admin Panel**: Manage products, track orders, and handle inventory
- **Riders Panel**: Manage deliveries and track order status

## Tech Stack

| Component | Technologies |
|-----------|--------------|
| **Frontend** | React, Tailwind CSS, Firebase Authentication |
| **Backend** | Node.js, Express, MongoDB, Firebase SDK |
| **Riders Frontend** | React, Tailwind CSS, Firebase Authentication |
| **Authentication** | Firebase Auth (Google Sign-In), JWT |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sanjanaynvsdl/E-Store.git
cd E-Store
```

### 2. Backend Setup

1. Navigate to backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FIREBASE_CREDENTIALS=your_firebase_credentials_json
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

4. The server will run on http://localhost:3000

### 3. Frontend Setup

1. Navigate to frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=G-7PTKSTQ133
   VITE_API_URL=http://localhost:3000
   ```

3. Start the frontend application:
   ```bash
   npm run dev
   ```

4. The application will be available at http://localhost:5173

### 4. Riders Frontend Setup

1. Navigate to riders-fe directory and install dependencies:
   ```bash
   cd riders-fe
   npm install
   ```

2. Create a `.env` file in the and refer above env set-up used for frontend directory. 
3. Start the riders frontend:
   ```bash
   npm run dev
   ```

## API Documentation

Explore the API endpoints using the Postman documentation:
[E-Store API Documentation](https://documenter.getpostman.com/view/39260427/2sB2ca7zcc)

## Deployed Applications

- **Customer & Admin Frontend**: [https://estore-shopnow.vercel.app/](https://estore-shopnow.vercel.app/)
- **Riders Frontend**: [https://riders-app-sooty.vercel.app/](https://riders-app-sooty.vercel.app/)
- **Backend**: Deployed on Render
