# AI-Powered Inventory & Quotation Management System

A comprehensive web application for small businesses to manage product inventory, generate customer quotations, and handle complex product structures with real-time analytics and AI-powered features.

## Project Status

### ✅ Phase 1: Backend Foundation & Core Data - COMPLETED

- Node.js Express API Gateway with MongoDB Atlas
- Complete authentication system with JWT
- User and Product schemas with comprehensive validation
- Full product CRUD operations with advanced filtering
- Master user creation script
- Environment configuration and security

### ✅ Phase 2: Frontend Foundation & Product Display - COMPLETED

- React.js frontend with Vite and Tailwind CSS
- Responsive design optimized for web browsers, iPad/tablets, and mobile devices
- Complete authentication flow (login, register, auto-login)
- Dashboard with real-time statistics and analytics
- Advanced product management interface with search and filtering
- Product CRUD operations with enhanced UI/UX
- Cross-device compatibility with no responsive design issues

### ✅ Phase 3: Core Workflow (Sales & Logistics) - COMPLETED

- Python Flask data service for CSV import and analytics
- Intelligent CSV parser with product structure detection
- **1,440 products** successfully imported from 19 CSV files
- Advanced product schema supporting:
  - Standalone products
  - Variant products (multiple colors/options)
  - Set products (multiple components)
  - Two-part systems (exposed + concealed parts)
  - Component products
- Batch import functionality with real-time progress tracking
- Enhanced product search with compatibility and requirements display

### ✅ Phase 4: Business Tools & Data Management - COMPLETED

- Complete quotation management system
- Advanced product search for quotations with real-time suggestions
- Quotation creation with customer information management
- Line items management with complex product types
- Pricing calculations with discounts and tax
- PDF generation for professional quotations
- Email functionality for quotation delivery
- Quotation status management and audit trail
- Dashboard analytics and statistics

### ⏳ Phase 5: AI, Analytics & Security - PLANNED

- Dashboard analytics with comprehensive metrics
- Predictive inventory AI integration (planned)
- AI Sales Assistant for product recommendations (planned)
- IP Whitelisting security middleware (planned)
- Advanced reporting and insights (planned)

### ❌ Missing Features (Not Yet Implemented)

- **Mini Bill Generation** - Quick POS-style billing system
- **Sales Recording** - Manual sales entry and stock deduction
- **Tally Integration** - Automated sales data from TallyPrime
- **Thermal Printer Support** - Mini bill printing functionality
- **Stock Adjustment History** - Track all stock changes with reasons
- **Customer Management** - Dedicated customer database
- **Sales Analytics** - Sales reports and trends
- **Inventory Alerts** - Low stock notifications
- **Barcode Scanning** - Product lookup via barcode
- **Multi-location Support** - Warehouse management

## Tech Stack

### Backend

- **API Gateway:** Node.js with Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Data Service:** Python with Flask
- **CSV Processing:** Pandas and custom parsers

### Frontend

- **Framework:** React.js with Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Routing:** React Router v6
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Analytics & AI (Planned)

- **Framework:** Python with Flask/FastAPI
- **AI Models:** Hugging Face integration
- **LLM Integration:** General-purpose language models
- **Analytics:** Advanced reporting and insights

## Quick Start

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas account

### Backend Server (Node.js API Gateway)

```bash
cd server
npm install
npm run dev
```

Server runs on: `http://localhost:5001`

### Data Service (Python Flask)

```bash
cd data-service
source venv/bin/activate
python app.py
```

Service runs on: `http://localhost:5002`

### Frontend Application

```bash
cd client
npm install
npm run dev
```

Application runs on: `http://localhost:5173`

### Environment Setup

1. Copy `.env.example` to `.env` in server directory
2. Configure MongoDB connection string
3. Set JWT secret key
4. Configure Python service URL

## Login Credentials

**Default Admin User:**

- **Email:** `admin@joharitrading.com`
- **Password:** `Admin@123`
- **Role:** `admin`

## Documentation

- **Phase 1:** `PHASE_1_DOCUMENTATION.md` ✅ COMPLETED
- **Phase 2:** `PHASE_2_DOCUMENTATION.md` ✅ COMPLETED
- **Phase 3:** `PHASE_3_DOCUMENTATION.md` ✅ COMPLETED
- **Phase 4:** `PHASE_4_DOCUMENTATION.md` ✅ COMPLETED
- **Phase 5:** `PHASE_5_DOCUMENTATION.md` 📝 PLANNED

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

### Quotations

- `POST /api/quotations` - Create quotation (protected)
- `GET /api/quotations` - Get all quotations (protected)
- `GET /api/quotations/:id` - Get single quotation (protected)
- `PUT /api/quotations/:id` - Update quotation (protected)
- `DELETE /api/quotations/:id` - Delete quotation (protected)
- `GET /api/quotations/:id/pdf` - Generate PDF (protected)
- `POST /api/quotations/:id/email` - Email quotation (protected)

### Data Import

- `POST /api/import/csv` - Import single CSV file
- `POST /api/import/batch` - Import all CSV files
- `GET /api/import/preview` - Preview import
- `GET /api/products/stats` - Get product statistics

## Project Structure

```
JTC/
├── client/           # React frontend (Phase 2 ✅)
├── server/           # Node.js API Gateway (Phase 1 ✅)
├── data-service/     # Python analytics service (Phase 3 ✅)
├── Product Categories/ # CSV data files (ignored by git)
├── logs/             # Application logs
├── images/           # Project assets
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

### ✅ Implemented Features

#### Core System

- **User Management**: Complete authentication with JWT, user roles, profile management
- **Product Inventory**: Full CRUD operations, advanced search, filtering, categorization
- **Stock Management**: Quantity tracking, low stock indicators, stock adjustments
- **Dashboard**: Real-time statistics, analytics, quick actions
- **Responsive Design**: Optimized for web browsers, tablets (iPad), and mobile devices

#### Advanced Product Management

- **Complex Product Types**: Support for 5 different product structures
  - Standalone products (single items)
  - Variant products (multiple colors/options)
  - Set products (multiple components)
  - Two-part systems (exposed + concealed parts)
  - Component products (parts of larger sets)
- **Intelligent Search**: Partial SKU matching, real-time suggestions, compatibility display
- **Product Import**: CSV batch import with 1,440 products from 19 files
- **Enhanced UI**: Improved product cards with stable information display

#### Quotation System

- **Quotation Creation**: Customer information, line items, pricing calculations
- **Advanced Product Search**: Real-time suggestions, variant selection, compatibility checks
- **Pricing Engine**: Automatic calculations, discounts, tax computation
- **PDF Generation**: Professional quotation documents
- **Email Integration**: Send quotations to customers
- **Status Management**: Draft, sent, approved, rejected, expired, converted
- **Audit Trail**: Complete history of changes and actions

#### Data Import & Analytics

- **CSV Processing**: Intelligent parser with product structure detection
- **Batch Operations**: Import multiple CSV files with progress tracking
- **Product Statistics**: Real-time analytics and reporting
- **Data Validation**: Comprehensive error checking and validation

### ❌ Missing Features (Not Yet Implemented)

#### Sales & Billing

- **Mini Bill Generation**: Quick POS-style billing system
- **Sales Recording**: Manual sales entry with stock deduction
- **Tally Integration**: Automated sales data from TallyPrime
- **Thermal Printer Support**: Mini bill printing functionality
- **Sales Analytics**: Sales reports, trends, and insights

#### Advanced Inventory

- **Stock Adjustment History**: Track all stock changes with reasons
- **Inventory Alerts**: Low stock notifications and warnings
- **Barcode Scanning**: Product lookup via barcode scanning
- **Multi-location Support**: Warehouse and location management

#### Customer Management

- **Customer Database**: Dedicated customer management system
- **Customer History**: Purchase history and quotation tracking
- **Customer Analytics**: Customer insights and behavior analysis

### 🔄 Planned Features (Phase 5)

#### AI & Analytics

- **Predictive Inventory AI**: Using Hugging Face models for demand forecasting
- **AI Sales Assistant**: Product recommendations and sales guidance
- **Advanced Analytics**: Comprehensive reporting and business insights
- **Dashboard Enhancements**: More detailed metrics and visualizations

#### Security & Compliance

- **IP Whitelisting**: Network security middleware
- **Enhanced Security**: Additional security measures and monitoring
- **Audit Logging**: Comprehensive activity tracking
- **Data Encryption**: Enhanced data protection

## Product Data Structure

The system supports 5 distinct product types:

1. **Standalone Products** - Single items with one price
2. **Variant Products** - Same product with multiple color/option variants
3. **Set Products** - Multiple components sold together
4. **Two-Part Systems** - Products requiring additional parts
5. **Component Products** - Parts that belong to larger sets

## Import Statistics

- **Total Products:** 1,440
- **Categories:** 14 (Bath Accessories, Faucets, Sanitaryware, etc.)
- **CSV Files:** 19 processed
- **Success Rate:** 100%
- **Product Types Detected:**
  - 1,261 standalone products
  - 156 set products
  - 12 two-part systems
  - 6 components
  - 5 variants

## Browser Support

**Target Browsers:**

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 10+)

## Security Considerations

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- MongoDB Atlas security

## Performance Optimizations

- Database indexing for fast queries
- Pagination for large datasets
- Lazy loading for frontend components
- Image optimization
- Caching strategies
- Bundle size optimization

## Contributing

This is a private, internal application. Development follows the strict phase-based approach with documentation-first methodology.

## License

Private - Internal Use Only

---

**Current Status:** Phase 4 Complete, Phase 5 Planning  
**Last Updated:** October 2025  
**Version:** 1.0.0
