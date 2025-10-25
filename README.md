# Inventory and Quotation Management System

A comprehensive web application for small businesses to manage product inventory, generate customer quotations, and create quick mini-bills for POS transactions with real-time analytics.

## Project Status

### ✅ Phase 1: Backend Foundation & API - COMPLETED

- Node.js Express API Gateway
- MongoDB database with User and Product schemas
- Complete authentication system
- Full product CRUD operations
- Comprehensive validation and error handling

### ✅ Phase 2: Frontend Foundation & Product Display - COMPLETED

- React.js frontend with Vite
- Tailwind CSS for responsive design
- Product management interface
- Cross-device optimization (web/iPad/mobile)
- Dashboard with real-time analytics
- Complete CRUD operations

### ⏳ Phase 3: Core Functionality & Python Analytics - PENDING

- Python Flask data service
- Dashboard analytics
- Excel import functionality
- Quotation generator

### ⏳ Phase 4: Mini Bill Feature & Security - PENDING

- Mini bill generator
- Thermal printer support
- IP whitelisting
- Final UI/UX polish

## Tech Stack

### Backend

- **API Gateway:** Node.js with Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator

### Frontend

- **Framework:** React.js with Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Routing:** React Router v6
- **Icons:** Lucide React

### Analytics Service (Upcoming)

- **Framework:** Python with Flask
- **Analytics:** TBD in Phase 3

## Quick Start

### Backend Server

```bash
cd server
npm install
npm run dev
```

Server runs on: `http://localhost:5001`

### Frontend Application

```bash
cd client
npm install
npm run dev
```

Application runs on: `http://localhost:5173`

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure MongoDB connection string
3. Set JWT secret key

## Documentation

- **Phase 1:** `PHASE_1_DOCUMENTATION.md` ✅ COMPLETED
- **Phase 2:** `PHASE_2_DOCUMENTATION.md` ✅ COMPLETED
- **Phase 3:** `PHASE_3_DOCUMENTATION.md` ✅ COMPLETED
- **Phase 4:** `PHASE_4_DOCUMENTATION.md` 📝 READY FOR APPROVAL

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Products

- `POST /api/products` - Create product (protected)
- `GET /api/products` - Get all products (protected)
- `GET /api/products/:id` - Get single product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)
- `PATCH /api/products/:id/quantity` - Adjust quantity (protected)

## Project Structure

```
JTC/
├── client/           # React frontend (Phase 2)
├── server/           # Node.js API Gateway (Phase 1 ✅)
├── data-service/     # Python analytics service (Phase 3)
└── README.md
```

## Development Approach

This project follows a strict documentation-driven development process:

1. **Documentation** - Detailed technical specs created first
2. **Approval** - Documentation reviewed and approved
3. **Development** - Code implementation
4. **Validation** - Functional testing and approval
5. **Next Phase** - Repeat for next phase

## Features

### Completed (Phase 1)

- ✅ User registration and authentication
- ✅ JWT-based authorization
- ✅ Product inventory management
- ✅ Automatic profit margin calculation
- ✅ Stock quantity tracking
- ✅ Low stock alerts
- ✅ Category management
- ✅ Product search and filtering
- ✅ Pagination support

### Upcoming

- Product display interface
- Dashboard with analytics
- Quotation generation
- Excel import/export
- Mini bill printing
- IP whitelisting
- Mobile/tablet optimization
