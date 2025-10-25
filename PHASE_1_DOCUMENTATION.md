# Phase 1: Backend Foundation & API - Technical Documentation

## Project Structure

The monorepo will be organized into three main directories:

**client** - React frontend application
**server** - Node.js Express API Gateway
**data-service** - Python Flask analytics service

## Database Schema Design

### User Collection

The User collection will store authentication and authorization information for system users.

**Collection Name:** users

**Fields:**

- Unique identifier generated automatically by MongoDB
- Email address serving as the primary login credential, must be unique and validated
- Hashed password using bcrypt with a salt round of 10
- Full name for display purposes
- Role field to determine access level (admin or user)
- Account creation timestamp
- Last modification timestamp

**Indexes:**

- Unique index on email field for fast lookup and enforcement of uniqueness

### Product Collection

The Product collection will store all inventory items with their details.

**Collection Name:** products

**Fields:**

- Unique identifier generated automatically by MongoDB
- Product name
- Detailed description of the product
- Category for grouping similar products (e.g., Electronics, Furniture, Stationery)
- Stock Keeping Unit code, must be unique
- Current quantity in stock (integer)
- Unit of measurement (e.g., pieces, boxes, kg)
- Purchase price per unit
- Selling price per unit
- Profit margin calculated as percentage
- Supplier name or identifier
- Low stock threshold for alert generation
- Boolean flag indicating if product is currently active
- Creation timestamp
- Last modification timestamp

**Indexes:**

- Unique index on SKU field
- Index on category field for filtered queries
- Index on active status for quick filtering

**Business Rules:**

- SKU must be unique across all products
- Quantity cannot be negative
- Selling price should typically be greater than purchase price
- Profit margin will be auto-calculated when prices are provided

## REST API Contract

### Base Configuration

**Base URL:** /api

**Response Format:** All responses will return JSON with a consistent structure containing success status, message, and data payload.

**Error Handling:** All errors will include appropriate HTTP status codes and descriptive error messages.

### Authentication Endpoints

#### User Registration

**Method:** POST  
**Endpoint:** /api/auth/register  
**Purpose:** Create a new user account

**Request Payload:**

- Email address (required, valid email format)
- Password (required, minimum 8 characters)
- Full name (required)
- Role (optional, defaults to user)

**Response:**

- HTTP 201 on success with user object (password excluded) and JWT token
- HTTP 400 if validation fails
- HTTP 409 if email already exists

#### User Login

**Method:** POST  
**Endpoint:** /api/auth/login  
**Purpose:** Authenticate existing user

**Request Payload:**

- Email address (required)
- Password (required)

**Response:**

- HTTP 200 on success with user object and JWT token
- HTTP 401 if credentials are invalid

#### Get Current User

**Method:** GET  
**Endpoint:** /api/auth/me  
**Purpose:** Retrieve authenticated user details  
**Authentication:** Required (JWT token in Authorization header)

**Response:**

- HTTP 200 with user object
- HTTP 401 if token is invalid or expired

### Product Endpoints

#### Create Product

**Method:** POST  
**Endpoint:** /api/products  
**Purpose:** Add a new product to inventory  
**Authentication:** Required

**Request Payload:**

- Name (required)
- Description (optional)
- Category (required)
- SKU (required, unique)
- Quantity (required, integer)
- Unit (required)
- Purchase price (required, positive number)
- Selling price (required, positive number)
- Supplier (optional)
- Low stock threshold (optional, defaults to 10)
- Active status (optional, defaults to true)

**Response:**

- HTTP 201 with created product object
- HTTP 400 if validation fails
- HTTP 409 if SKU already exists

#### Get All Products

**Method:** GET  
**Endpoint:** /api/products  
**Purpose:** Retrieve list of all products with optional filtering  
**Authentication:** Required

**Query Parameters:**

- category (optional) - filter by category
- active (optional) - filter by active status
- search (optional) - search in name, description, or SKU
- sort (optional) - field to sort by
- order (optional) - asc or desc
- page (optional) - page number for pagination
- limit (optional) - items per page

**Response:**

- HTTP 200 with array of products and pagination metadata

#### Get Single Product

**Method:** GET  
**Endpoint:** /api/products/:id  
**Purpose:** Retrieve detailed information for a specific product  
**Authentication:** Required

**URL Parameters:**

- id - MongoDB ObjectId of the product

**Response:**

- HTTP 200 with product object
- HTTP 404 if product not found

#### Update Product

**Method:** PUT  
**Endpoint:** /api/products/:id  
**Purpose:** Modify existing product details  
**Authentication:** Required

**URL Parameters:**

- id - MongoDB ObjectId of the product

**Request Payload:**

- Any product fields to update (all optional)

**Response:**

- HTTP 200 with updated product object
- HTTP 400 if validation fails
- HTTP 404 if product not found
- HTTP 409 if SKU conflicts with existing product

#### Delete Product

**Method:** DELETE  
**Endpoint:** /api/products/:id  
**Purpose:** Remove a product from the system  
**Authentication:** Required

**URL Parameters:**

- id - MongoDB ObjectId of the product

**Response:**

- HTTP 200 with success message
- HTTP 404 if product not found

#### Adjust Product Quantity

**Method:** PATCH  
**Endpoint:** /api/products/:id/quantity  
**Purpose:** Update stock quantity (for inventory adjustments)  
**Authentication:** Required

**URL Parameters:**

- id - MongoDB ObjectId of the product

**Request Payload:**

- adjustment - number to add (positive) or subtract (negative)
- reason (optional) - description of adjustment reason

**Response:**

- HTTP 200 with updated product object
- HTTP 400 if adjustment would result in negative quantity
- HTTP 404 if product not found

## Authentication Strategy

The system will use JWT (JSON Web Tokens) for stateless authentication.

**Token Generation:**

- Upon successful login or registration, the server will generate a JWT containing the user ID and role
- Token will expire after 7 days
- Token secret will be stored in environment variables

**Token Verification:**

- Protected routes will use authentication middleware
- Middleware will extract token from Authorization header (Bearer scheme)
- Middleware will verify token signature and expiration
- Valid requests will attach user information to the request object
- Invalid or missing tokens will return HTTP 401

**Password Security:**

- All passwords will be hashed using bcrypt before storage
- Plain text passwords will never be stored or logged
- Password comparison will use bcrypt's secure comparison

## Environment Configuration

The server will require the following environment variables:

- MongoDB connection string
- JWT secret key for token signing
- Port number for the server
- Node environment setting
- Python service URL for inter-service communication

These will be stored in a .env file which will be excluded from version control.

## Error Handling & Validation

**Input Validation:**

- All incoming requests will be validated before processing
- Validation errors will return HTTP 400 with specific field error messages
- Email format, password strength, and required fields will be checked

**Database Errors:**

- Duplicate key errors will return HTTP 409
- Cast errors (invalid ObjectId format) will return HTTP 400
- Connection errors will return HTTP 503

**Authentication Errors:**

- Missing or invalid tokens will return HTTP 401
- Insufficient permissions will return HTTP 403

**General Errors:**

- Unhandled errors will return HTTP 500 with a generic message
- Detailed error information will be logged server-side but not exposed to clients

## API Response Structure

**Success Response Format:**

- success: boolean (true)
- message: descriptive string
- data: response payload (object or array)

**Error Response Format:**

- success: boolean (false)
- message: error description
- errors: array of specific validation errors (if applicable)

## CORS Configuration

The server will be configured to accept requests from the frontend application origin. CORS headers will be set appropriately to allow credentials and common HTTP methods.

## Middleware Stack

The Express application will use the following middleware in order:

1. CORS configuration
2. JSON body parser
3. URL-encoded body parser
4. Request logging
5. Authentication middleware (for protected routes)
6. Route handlers
7. 404 handler for unknown routes
8. Global error handler

## Development Considerations

**Code Organization:**

- Separate files for routes, controllers, services, and models
- Modular architecture with clear separation of concerns
- Each domain (auth, products) will have its own router module

**Testing Strategy:**

- API endpoints will be designed for easy testing
- Clear separation between business logic and route handlers

**Logging:**

- Request logging for all API calls
- Error logging with appropriate detail levels
- Success operations will be logged at info level

---

## Phase 1 Deliverables Summary

Upon approval of this documentation, the following will be implemented:

1. Complete monorepo folder structure
2. Node.js Express server with all middleware configured
3. MongoDB connection setup with Mongoose
4. User and Product Mongoose schemas
5. Complete authentication system (register, login, token verification)
6. Full CRUD operations for products
7. Input validation and error handling
8. Environment configuration system
9. All endpoints tested and functional

**Next Steps After Phase 1 Validation:**
Phase 2 will focus on building the React frontend foundation and connecting it to these backend APIs to display and manage products.

---

## ✅ PHASE 1 - COMPLETED

**Status:** Successfully Implemented and Running

**Live Services:**

- Backend API: `http://localhost:5001`
- MongoDB Atlas: Connected and Operational

**All Deliverables Completed:**

1. ✅ Node.js Express API Gateway
2. ✅ MongoDB connection with Mongoose
3. ✅ User and Product models with schemas
4. ✅ JWT-based authentication system
5. ✅ Complete product CRUD operations
6. ✅ Input validation and error handling
7. ✅ Standardized API responses
8. ✅ Environment configuration
9. ✅ All endpoints tested and functional

**Files Created:**

- Server configuration and database connection
- Models (User, Product)
- Controllers (auth, product)
- Middleware (auth, validation, error handling)
- Routes (auth, product)
- Validators (auth, product)
- Utilities (JWT, response)

**Validation Completed:** All API endpoints tested and working correctly.
