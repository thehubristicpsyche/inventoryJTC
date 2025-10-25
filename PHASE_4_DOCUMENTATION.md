# PHASE 4: QUOTATION MANAGEMENT SYSTEM

**Status:** Documentation Phase  
**Purpose:** Build a comprehensive quotation system that allows users to create, manage, and track quotations with advanced product search and pricing capabilities.

---

## Overview

Phase 4 introduces a complete quotation management system that leverages the enhanced product schema from Phase 3. The system enables users to search products efficiently, build detailed quotations with multiple line items, apply discounts, track quotation status, and generate professional PDF documents.

---

## Core Features

### 1. Quotation Creation and Management

- Create new quotations with customer information
- Add multiple products as line items with quantities
- Automatically fetch product details (name, price, variants, compatibility)
- Handle complex product types (sets, variants, two-part systems)
- Display component breakdowns for sets
- Apply line-item level and overall discounts
- Calculate subtotals, tax, and grand totals
- Save quotations as drafts
- Edit existing quotations
- Delete quotations
- Duplicate quotations for similar customers

### 2. Advanced Product Search for Quotations

- **Flexible Partial Search**: Search by full or partial SKU, product name, or category
  - Example: SKU "S1053102" can be found by typing "S1", "053", or "3102"
  - Search matches anywhere in SKU, not just at the beginning
  - Case-insensitive search
- **Real-Time Suggestions**: Instant dropdown suggestions as user types
  - Show top 10 matching products
  - Display SKU, name, category, and price in suggestions
  - Keyboard navigation support (arrow keys, enter to select)
  - Highlight matching text in suggestions
- **Compatibility & Requirements Display**:
  - Show which systems/models the product works with
  - Display prerequisites (e.g., "Requires concealed part: XXX")
  - Show compatible accessories
  - Alert if product is part of a set
- **Variant Selection**:
  - Display available variants (colors, finishes) in search results
  - Quick variant selector in dropdown
  - Show price differences between variants
  - Display stock availability per variant
- **Category Filtering**: Filter by product categories from CSV imports
- **Product Structure Filtering**: Filter by standalone, set, variant, two-part
- **Smart Search Ranking**: Prioritize exact matches, then partial matches, then fuzzy matches

### 3. Quotation Status Management

- Draft: Initial creation, can be edited freely
- Sent: Quotation sent to customer, read-only unless converted back to draft
- Approved: Customer accepted the quotation
- Rejected: Customer declined the quotation
- Expired: Quotation validity period has passed
- Converted: Quotation converted to order/invoice

### 4. Customer Management

- Store customer contact information with quotations
- Customer name and company details
- Contact number and email
- Billing address
- Shipping address (if different)
- Quick customer lookup for repeat quotations
- Customer quotation history

### 5. Pricing and Calculations

- Automatic price fetching based on product structure
- Variant-specific pricing
- Set pricing with component breakdown
- Line-item subtotals
- Line-item discounts (percentage or fixed amount)
- Overall quotation discount
- Tax calculation (configurable tax rates)
- Grand total calculation
- Price validity period

### 6. PDF Generation

- Professional quotation layout
- Company branding and logo
- Quotation number and date
- Customer details
- Itemized product list with descriptions
- Component breakdowns for sets
- Subtotals and totals
- Terms and conditions
- Validity period
- Digital signature option
- Download and email functionality

### 7. Quotation Dashboard

- List all quotations with filters
- Filter by status
- Filter by date range
- Filter by customer
- Search by quotation number
- Sort by date, amount, status
- Quick statistics (total quotations, pending, approved, total value)
- Export quotation list

---

## Database Schema Design

### Quotation Collection

#### Basic Information

- Quotation number (auto-generated, unique)
- Quotation date
- Valid until date
- Reference number (optional, customer's reference)
- Created by (user reference)
- Last modified date
- Status (enum: draft, sent, approved, rejected, expired, converted)

#### Customer Information

- Customer name (required)
- Company name
- Contact person
- Email address
- Phone number
- Billing address (object with street, city, state, pincode, country)
- Shipping address (object, optional)
- GST number (optional)
- Customer notes (internal notes about customer)

#### Line Items (Array)

Each line item contains:

- Product reference (Product ID)
- Product code (SKU) - denormalized for historical reference
- Product name - denormalized
- Product type (standalone, set, variant, two-part)
- Variant details (if applicable - color, finish)
- Component details (if set - array of component names and codes)
- Unit price
- Quantity
- Unit of measurement
- Line item subtotal (unitPrice × quantity)
- Discount type (percentage or fixed)
- Discount value
- Line item total (after discount)
- Product notes (specific notes for this line item)

#### Pricing and Totals

- Subtotal (sum of all line item totals)
- Overall discount type (percentage or fixed)
- Overall discount value
- Amount after discount
- Tax rate (percentage)
- Tax amount
- Grand total
- Currency (default INR)

#### Additional Information

- Terms and conditions (text or reference to default terms)
- Payment terms
- Delivery terms
- Special instructions
- Internal notes (not visible in PDF)
- Attachments (array of file references)

#### Audit Trail

- Created at timestamp
- Updated at timestamp
- Status history (array of status changes with timestamps and user)
- Email history (when quotation was emailed)
- PDF generation history

---

## API Endpoints Design

### Quotation Routes

#### POST /api/quotations

Create a new quotation

- Request body: customer info, line items, pricing details
- Validation: customer details, product references, pricing calculations
- Auto-generate quotation number
- Set initial status as 'draft'
- Return created quotation with full details

#### GET /api/quotations

Retrieve all quotations with filters

- Query parameters: status, customer, dateFrom, dateTo, search, page, limit, sort, order
- Pagination support
- Return quotations list with pagination metadata
- Include summary statistics

#### GET /api/quotations/stats

Retrieve quotation statistics

- Total quotations count
- Count by status
- Total value by status
- Recent quotations
- Top customers

#### GET /api/quotations/:id

Retrieve single quotation by ID

- Populate product details
- Populate user details
- Include full audit trail
- Return complete quotation object

#### PUT /api/quotations/:id

Update existing quotation

- Only allowed for draft or sent status
- Validation: ensure products still exist and are active
- Recalculate totals
- Update modified timestamp
- Record in audit trail

#### PATCH /api/quotations/:id/status

Update quotation status

- Validate status transition
- Record status change in audit trail
- Update status timestamp
- Notify relevant parties if configured

#### DELETE /api/quotations/:id

Delete quotation (soft delete)

- Only allowed for draft quotations
- Mark as deleted instead of removing
- Record deletion in audit trail

#### POST /api/quotations/:id/duplicate

Duplicate an existing quotation

- Copy all details except quotation number and dates
- Set status as draft
- Generate new quotation number
- Allow customer modification

#### GET /api/quotations/:id/pdf

Generate PDF for quotation

- Fetch complete quotation details
- Populate all product information
- Generate professional PDF layout
- Return PDF file or download link
- Record PDF generation in audit trail

#### POST /api/quotations/:id/email

Email quotation to customer

- Generate PDF
- Compose email with quotation details
- Send to customer email
- Record email activity in audit trail

#### POST /api/quotations/:id/line-items

Add line item to existing quotation

- Only for draft status
- Validate product reference
- Fetch product details
- Calculate line item total
- Recalculate quotation totals

#### PUT /api/quotations/:id/line-items/:lineItemId

Update line item

- Only for draft status
- Validate changes
- Recalculate line item total
- Recalculate quotation totals

#### DELETE /api/quotations/:id/line-items/:lineItemId

Remove line item from quotation

- Only for draft status
- Remove line item
- Recalculate quotation totals

---

## Frontend Components Structure

### Pages

#### QuotationsPage

Main quotations list page

- Display all quotations in table/card view
- Filters and search bar
- Status badges with colors
- Quick actions (view, edit, delete)
- Create new quotation button
- Export functionality
- Pagination controls
- Summary statistics cards

#### CreateQuotationPage

Create new quotation page

- Step-by-step wizard or single page form
- Customer information section
- Product search and selection
- Line items table with inline editing
- Add/remove line items
- Pricing and discount section
- Terms and conditions
- Save as draft or finalize
- Preview before saving

#### EditQuotationPage

Edit existing quotation

- Similar to create page
- Pre-filled with existing data
- Status indicator
- Edit restrictions based on status
- Convert back to draft option
- Update history sidebar

#### QuotationDetailsPage

View quotation details (read-only)

- Complete quotation information
- Customer details
- Line items with full breakdown
- Pricing breakdown
- Status timeline
- Action buttons (PDF, email, duplicate, edit)
- Audit trail

#### QuotationPDFPreviewPage

Preview quotation PDF before download

- Show PDF preview
- Download button
- Email button
- Print option
- Edit quotation link

### Components

#### QuotationForm

Main form for creating/editing quotations

- Customer information inputs
- Product search and selection interface
- Line items management
- Pricing calculations display
- Form validation

#### CustomerInfoForm

Customer details section

- Name, company, contact fields
- Address inputs
- GST number field
- Customer lookup functionality

#### ProductSearchBar

Advanced product search component

- Real-time search with debounce
- Dropdown suggestions
- Display product details in suggestions
- Variant selector
- Add to quotation button

#### LineItemsTable

Table showing quotation line items

- Product details columns
- Quantity inputs
- Price display
- Discount inputs
- Subtotal calculations
- Edit and delete actions
- Add new item row

#### PricingSummary

Pricing breakdown display

- Subtotal
- Discounts
- Tax calculation
- Grand total
- Large, prominent display

#### QuotationStatusBadge

Visual status indicator

- Color-coded badges
- Status text
- Icon representation

#### QuotationFilters

Filter controls for quotation list

- Status filter dropdown
- Date range picker
- Customer search
- Clear filters button

#### QuotationActionsMenu

Action buttons for quotation

- View details
- Edit
- Duplicate
- Download PDF
- Email
- Delete
- Status change

#### QuotationStatsCards

Dashboard statistics cards

- Total quotations
- Pending quotations
- Approved value
- Recent activity

---

## Business Logic and Validations

### Quotation Number Generation

- Format: QT-YYYY-NNNN (QT-2025-0001)
- Auto-increment based on year
- Reset counter each year
- Ensure uniqueness
- Configurable prefix

### Product Addition Validation

- Verify product exists and is active
- Check if product requires other parts
- Warn about compatibility requirements
- Suggest compatible accessories
- Validate variant selection for variant products

### Pricing Calculations

- Calculate line item subtotal: unitPrice × quantity
- Apply line item discount
- Sum all line items for subtotal
- Apply overall discount to subtotal
- Calculate tax on discounted amount
- Calculate grand total

### Discount Validation

- Percentage discounts: 0-100%
- Fixed amount discounts: must not exceed subtotal
- Line item discount cannot make price negative
- Overall discount cannot make subtotal negative
- Configurable maximum discount limits by user role

### Status Transitions

Valid status transitions:

- Draft → Sent
- Draft → Deleted
- Sent → Approved
- Sent → Rejected
- Sent → Draft (with permission)
- Approved → Converted
- Any → Expired (automatic based on validity date)

### Date Validations

- Quotation date: default to today, can be backdated
- Valid until date: must be after quotation date
- Default validity: 30 days from quotation date
- Warn when validity approaching expiration

### Customer Information Requirements

- Minimum required: name, email or phone
- Email format validation
- Phone number format validation
- GST number format validation (if provided)

---

## UI/UX Considerations

### Responsive Design

- Mobile-optimized quotation list
- Touch-friendly product search
- Collapsible sections on mobile
- Horizontal scrolling for line items table on mobile
- Stack customer and pricing sections vertically on mobile

### User Experience

- Auto-save drafts functionality
- Keyboard shortcuts for common actions
- Inline editing for line items
- Quick product addition
- Smart defaults (current date, standard validity period)
- Copy product code to clipboard
- Bulk product addition
- Import line items from CSV

### Visual Feedback

- Loading indicators during calculations
- Success/error messages
- Confirmation dialogs for destructive actions
- Real-time validation feedback
- Progress indicator for multi-step quotation creation
- Price change warnings

### Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators

---

## PDF Generation Specifications

### Layout Structure

- Header: Company logo and details
- Quotation metadata: number, date, validity
- Customer information section
- Line items table with proper formatting
- Pricing summary prominently displayed
- Footer: Terms, conditions, and signature block

### Styling

- Professional typography
- Brand colors
- Clean table layouts
- Proper spacing and margins
- Page breaks for multi-page quotations
- Page numbers

### Content Sections

- Company information with logo
- Quotation title and number
- Date issued and valid until
- Customer details (billing and shipping)
- Itemized product table
  - Product code
  - Description
  - Quantity
  - Unit price
  - Discount
  - Line total
- Component breakdown for sets (indented or in notes)
- Subtotal, discount, tax, grand total
- Payment terms
- Delivery terms
- Terms and conditions
- Authorized signature section
- Footer with page numbers and company tagline

---

## Error Handling

### Product Not Found

- Display error when product doesn't exist
- Suggest similar products
- Allow manual entry with approval

### Insufficient Stock Warning

- Warn when quotation quantity exceeds stock
- Show available stock
- Allow to proceed with warning

### Calculation Errors

- Handle decimal precision
- Prevent negative values
- Handle currency conversion if needed

### PDF Generation Failures

- Retry mechanism
- Fallback to simple format
- Error notification to user

### Network Errors

- Auto-save to prevent data loss
- Retry failed requests
- Offline mode indicators

---

## Performance Optimizations

### Database

- Index on quotation number
- Index on customer email
- Index on status and date
- Compound indexes for common queries
- Denormalize product details to prevent lookups

### Frontend

- Lazy load quotation list
- Virtual scrolling for large lists
- Debounce search inputs
- Cache product search results
- Optimize PDF generation

### API

- Pagination for all list endpoints
- Field selection to reduce payload
- Caching for frequently accessed data
- Batch operations for bulk actions

---

## Security Considerations

### Authorization

- Role-based access control
- Users can only view their own quotations (unless admin)
- Restrict status changes based on role
- Audit trail for all changes

### Data Validation

- Server-side validation for all inputs
- Sanitize customer inputs
- Prevent SQL injection
- XSS prevention in PDF generation

### Sensitive Information

- Mask customer phone numbers in lists
- Encrypt sensitive customer data
- Secure PDF storage
- Email security for quotation delivery

---

## Integration Points

### Product Catalog

- Real-time product availability check
- Price synchronization
- Product updates reflection in existing quotations (with warnings)

### Customer Database

- Link quotations to customer records
- Customer purchase history
- Quotation conversion tracking

### Email Service

- Configure SMTP settings
- Email templates for quotations
- Delivery tracking
- Bounce handling

### Future Integrations (Post-Phase 4)

- Accounting system integration
- Payment gateway for online approvals
- E-signature integration
- CRM integration
- Order management system

---

## Testing Requirements

### Unit Tests

- Quotation number generation
- Price calculations
- Discount validations
- Status transitions

### Integration Tests

- Quotation CRUD operations
- Product addition to quotations
- PDF generation
- Email sending

### UI Tests

- Form validation
- Product search functionality
- Line item management
- Quotation list filters

---

## Deployment Considerations

### Environment Variables

- PDF generation service configuration
- Email service credentials
- Default tax rates
- Default validity period
- Maximum discount limits
- Currency settings

### File Storage

- PDF storage location
- Quotation attachments storage
- Backup strategy

### Monitoring

- Track quotation creation rate
- Monitor PDF generation success rate
- Track email delivery rates
- Alert on failed operations

---

## Phase 4 Development Plan

### Step 1: Backend - Quotation Model and Basic CRUD

- Create Quotation schema in MongoDB
- Implement quotation controller
- Create quotation routes
- Add validation middleware
- Implement quotation number generation
- Test CRUD operations

### Step 2: Backend - Line Items and Calculations

- Implement line item management
- Create pricing calculation logic
- Add discount calculation
- Implement tax calculation
- Add validation for calculations
- Test all calculation scenarios

### Step 3: Backend - Status Management

- Implement status transition logic
- Add status validation
- Create audit trail functionality
- Add status change API endpoints
- Test status workflows

### Step 4: Frontend - Quotation List Page

- Create quotations list component
- Implement filters and search
- Add pagination
- Create statistics cards
- Add action buttons
- Implement responsive design

### Step 5: Frontend - Create Quotation Page

- Build customer information form
- Implement product search component
- Create line items table
- Add pricing summary
- Implement form validation
- Add save functionality

### Step 6: Frontend - Quotation Details and Edit

- Create quotation details view
- Implement edit functionality
- Add status management UI
- Create audit trail display
- Add action buttons

### Step 7: PDF Generation

- Integrate PDF generation library
- Design PDF template
- Implement PDF generation endpoint
- Add download functionality
- Test various quotation scenarios

### Step 8: Email Integration

- Configure email service
- Create email templates
- Implement send email endpoint
- Add email tracking
- Test email delivery

### Step 9: Testing and Validation

- Comprehensive testing of all features
- User acceptance testing
- Performance testing
- Fix bugs and issues
- Documentation updates

### Step 10: Deployment and Completion

- Deploy to production
- Monitor for issues
- Gather user feedback
- Final documentation update

---

## Success Criteria

Phase 4 will be considered complete when:

1. ✅ Users can create quotations with customer information
2. ✅ Product search returns accurate results with all details
3. ✅ Line items can be added, edited, and removed
4. ✅ Pricing calculations are accurate (subtotal, discounts, tax, total)
5. ✅ Quotations can be saved as drafts and edited
6. ✅ Status management works correctly
7. ✅ PDF generation produces professional quotations
8. ✅ Quotations can be emailed to customers
9. ✅ Quotation list with filters works correctly
10. ✅ All operations are responsive and work on mobile/tablet
11. ✅ Data validation prevents errors
12. ✅ No critical bugs in quotation workflow

---

**Next Step:** Await approval to begin Phase 4 development following this documentation.
