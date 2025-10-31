# Environment Configuration Documentation

This document contains all the necessary environment configuration information for the AI-Powered Inventory & Quotation Management System.

## 📁 **SERVER/.env** (Node.js API Gateway)

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://DBADMIN:DBadmin%402025@inventoryjtc.q1fkdjq.mongodb.net/inventory_management?retryWrites=true&w=majority&appName=inventoryJTC

# JWT Configuration
JWT_SECRET=5f0d03183e36f8d344103d8f27de5daa
JWT_EXPIRE=7d

# Python Service
PYTHON_SERVICE_URL=http://localhost:5002

# CORS
CLIENT_URL=http://localhost:5173
```

**Configuration Details:**

- **Server Port:** 5001
- **Environment:** Development mode
- **Database:** MongoDB Atlas with specific database `inventory_management`
- **JWT Secret:** Custom secret key for token signing
- **JWT Expiry:** 7 days
- **Python Service:** Points to localhost:5002
- **CORS:** Allows requests from localhost:5173 (React app)

---

## 📁 **DATA-SERVICE/.env** (Python Flask Service)

```env
PORT=5002
DEBUG=True
MONGODB_URI=mongodb+srv://DBADMIN:DBadmin%402025@inventoryjtc.q1fkdjq.mongodb.net/inventory_management?retryWrites=true&w=majority
```

**Configuration Details:**

- **Service Port:** 5002
- **Debug Mode:** Enabled
- **Database:** Same MongoDB Atlas instance as server

---

## 📁 **CLIENT/.env** (React Frontend)

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=Inventory Management System
```

**Configuration Details:**

- **API Base URL:** Points to Node.js server at localhost:5001/api
- **App Name:** "Inventory Management System"

---

## 🔑 **Critical Security Information**

### **Database Credentials:**

- **Username:** `DBADMIN`
- **Password:** `DBadmin@2025` (URL encoded as `DBadmin%402025`)
- **Cluster:** `inventoryjtc.q1fkdjq.mongodb.net`
- **Database:** `inventory_management`
- **Connection String:** `mongodb+srv://DBADMIN:DBadmin%402025@inventoryjtc.q1fkdjq.mongodb.net/inventory_management?retryWrites=true&w=majority&appName=inventoryJTC`

### **JWT Configuration:**

- **Secret Key:** `5f0d03183e36f8d344103d8f27de5daa`
- **Expiry:** 7 days
- **Algorithm:** Default (HS256)

### **Service Architecture:**

- **Frontend (React):** `http://localhost:5173`
- **Backend API (Node.js):** `http://localhost:5001`
- **Data Service (Python):** `http://localhost:5002`

---

## 🌐 **Network Configuration**

### **Ports Used:**

- **5001:** Node.js Express API Gateway
- **5002:** Python Flask Data Service
- **5173:** React Development Server

### **CORS Configuration:**

- **Allowed Origin:** `http://localhost:5173`
- **API Endpoint:** `http://localhost:5001/api`

---

## ⚠️ **Security Notes**

1. **JWT Secret:** Currently hardcoded - should be more secure in production
2. **Database Password:** Contains special characters (@) that are URL encoded
3. **Environment:** All services configured for localhost development
4. **Debug Mode:** Enabled in Python service (development only)

---

## 🚀 **Service Dependencies**

- **Frontend** → **Backend API** (localhost:5001)
- **Backend API** → **MongoDB Atlas** (cloud database)
- **Backend API** → **Python Service** (localhost:5002)
- **Python Service** → **MongoDB Atlas** (cloud database)

---

## 📋 **Quick Start Commands**

### **Start Backend Server (Node.js API Gateway):**

```bash
cd server
npm install
npm run dev
```

Server runs on: `http://localhost:5001`

### **Start Data Service (Python Flask):**

```bash
cd data-service
source venv/bin/activate
python app.py
```

Service runs on: `http://localhost:5002`

### **Start Frontend Application:**

```bash
cd client
npm install
npm run dev
```

Application runs on: `http://localhost:5173`

---

## 🔧 **Environment Setup**

1. Copy `.env.example` to `.env` in server directory
2. Configure MongoDB connection string
3. Set JWT secret key
4. Configure Python service URL

---

## 📊 **Current Service Status**

All services are currently running and properly configured for development use:

- ✅ **Node.js Server:** Running on port 5001
- ✅ **React Frontend:** Running on port 5173
- ✅ **Python Data Service:** Running on port 5002
- ✅ **MongoDB Atlas:** Connected and operational

---

## 🔐 **Login Credentials**

**Default Admin User:**

- **Email:** `admin@joharitrading.com`
- **Password:** `Admin@123`
- **Role:** `admin`

---

_Last Updated: October 25, 2025_
_Document Version: 1.0_

