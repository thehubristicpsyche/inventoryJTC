import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  // Basic Information
  quotationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  quotationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'approved', 'rejected', 'expired', 'converted'],
    default: 'draft'
  },

  // Customer Information
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    companyName: {
      type: String,
      trim: true
    },
    contactPerson: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    customerNotes: String
  },

  // Line Items
  lineItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productCode: {
      type: String,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productType: {
      type: String,
      enum: ['standalone', 'set', 'variant', 'two-part', 'component']
    },
    variantDetails: {
      color: String,
      finish: String,
      size: String
    },
    componentDetails: [{
      name: String,
      code: String
    }],
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: {
      type: String,
      default: 'pcs'
    },
    lineSubtotal: {
      type: Number,
      required: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed', 'none'],
      default: 'none'
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0
    },
    lineTotal: {
      type: Number,
      required: true
    },
    notes: String
  }],

  // Pricing and Totals
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  overallDiscountType: {
    type: String,
    enum: ['percentage', 'fixed', 'none'],
    default: 'none'
  },
  overallDiscountValue: {
    type: Number,
    default: 0,
    min: 0
  },
  amountAfterDiscount: {
    type: Number,
    required: true,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 18, // Default GST rate
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    required: true,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },

  // Additional Information
  termsAndConditions: {
    type: String,
    default: 'Standard terms and conditions apply.'
  },
  paymentTerms: {
    type: String,
    default: '100% advance payment'
  },
  deliveryTerms: {
    type: String,
    default: 'Standard delivery within 7-10 business days'
  },
  specialInstructions: String,
  internalNotes: String,
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Audit Trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  emailHistory: [{
    sentTo: String,
    sentAt: { type: Date, default: Date.now },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  pdfGenerated: [{
    generatedAt: { type: Date, default: Date.now },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Auto-generate quotation number
quotationSchema.pre('save', async function(next) {
  if (this.isNew && !this.quotationNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Quotation').countDocuments({
      quotationNumber: new RegExp(`^QT-${year}-`)
    });
    this.quotationNumber = `QT-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate totals before saving
quotationSchema.pre('save', function(next) {
  // Calculate subtotal from line items
  this.subtotal = this.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

  // Calculate amount after overall discount
  if (this.overallDiscountType === 'percentage') {
    this.amountAfterDiscount = this.subtotal - (this.subtotal * this.overallDiscountValue / 100);
  } else if (this.overallDiscountType === 'fixed') {
    this.amountAfterDiscount = this.subtotal - this.overallDiscountValue;
  } else {
    this.amountAfterDiscount = this.subtotal;
  }

  // Calculate tax amount
  this.taxAmount = this.amountAfterDiscount * (this.taxRate / 100);

  // Calculate grand total
  this.grandTotal = this.amountAfterDiscount + this.taxAmount;

  next();
});

// Indexes for better performance
quotationSchema.index({ quotationNumber: 1 });
quotationSchema.index({ 'customer.email': 1 });
quotationSchema.index({ status: 1 });
quotationSchema.index({ quotationDate: -1 });
quotationSchema.index({ createdBy: 1 });

// Virtual for checking if quotation is expired
quotationSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil && this.status !== 'converted';
});

// Instance method to add line item
quotationSchema.methods.addLineItem = function(lineItem) {
  // Calculate line subtotal
  lineItem.lineSubtotal = lineItem.unitPrice * lineItem.quantity;

  // Calculate line total after discount
  if (lineItem.discountType === 'percentage') {
    lineItem.lineTotal = lineItem.lineSubtotal - (lineItem.lineSubtotal * lineItem.discountValue / 100);
  } else if (lineItem.discountType === 'fixed') {
    lineItem.lineTotal = lineItem.lineSubtotal - lineItem.discountValue;
  } else {
    lineItem.lineTotal = lineItem.lineSubtotal;
  }

  this.lineItems.push(lineItem);
};

// Instance method to update status
quotationSchema.methods.updateStatus = function(newStatus, userId, notes) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
    notes: notes || `Status changed to ${newStatus}`
  });
};

// Instance method to record email sent
quotationSchema.methods.recordEmailSent = function(email, userId) {
  this.emailHistory.push({
    sentTo: email,
    sentBy: userId
  });
};

// Instance method to record PDF generation
quotationSchema.methods.recordPDFGenerated = function(userId) {
  this.pdfGenerated.push({
    generatedBy: userId
  });
};

const Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;





