# Inventory Management System - Backend API

Node.js Express API Gateway for the Inventory and Quotation Management System.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Fill in the required credentials in the `.env` file.

### 3. Start the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user (protected)

### Products

- POST `/api/products` - Create product (protected)
- GET `/api/products` - Get all products with filtering (protected)
- GET `/api/products/:id` - Get single product (protected)
- PUT `/api/products/:id` - Update product (protected)
- DELETE `/api/products/:id` - Delete product (protected)
- PATCH `/api/products/:id/quantity` - Adjust quantity (protected)

### Health Check

- GET `/health` - Server health status

## Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── productController.js # Product CRUD logic
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── errorHandler.js     # Global error handling
│   └── validator.js        # Validation middleware
├── models/
│   ├── User.js             # User schema
│   └── Product.js          # Product schema
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   └── productRoutes.js    # Product endpoints
├── utils/
│   ├── jwt.js              # JWT utilities
│   └── response.js         # Response helpers
├── validators/
│   ├── authValidator.js    # Auth validation rules
│   └── productValidator.js # Product validation rules
├── .env.example            # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js               # Application entry point
```




