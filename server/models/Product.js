import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // ========== BASIC IDENTIFICATION ==========
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU (Product Code) is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    productCodeSeries: {
      type: String,
      trim: true,
      default: '',
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    productType: {
      type: String,
      trim: true,
      default: ''
    },
    brand: {
      type: String,
      trim: true,
      default: 'CERA'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    
    // ========== PRODUCT STRUCTURE TYPE ==========
    // Helps user understand what kind of product this is
    productStructure: {
      type: String,
      enum: ['standalone', 'variant', 'set', 'component', 'two-part'],
      default: 'standalone',
      index: true
    },
    
    // ========== PRICING ==========
    // Base price (typically Snow White color)
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative']
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Purchase price is required'],
      min: [0, 'Purchase price cannot be negative']
    },
    profitMargin: {
      type: Number,
      default: 0
    },
    mrp: {
      type: Number,
      min: [0, 'MRP cannot be negative'],
      default: 0
    },
    
    // For products with multiple color options at different prices
    priceByColor: [{
      color: String,
      price: Number,
      purchasePrice: Number
    }],
    
    // ========== INVENTORY ==========
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer'
      }
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
      default: 'pcs'
    },
    lowStockThreshold: {
      type: Number,
      min: [0, 'Low stock threshold cannot be negative'],
      default: 10
    },
    reorderPoint: {
      type: Number,
      min: [0, 'Reorder point cannot be negative'],
      default: 5
    },
    maxStock: {
      type: Number,
      min: [0, 'Max stock cannot be negative'],
      default: 0
    },
    
    // Track stock by variant (for multi-color products)
    stockByVariant: [{
      variantKey: String,    // e.g., "Snow White", "Ivory", "Chrome"
      stock: { type: Number, default: 0 }
    }],
    
    // ========== PRODUCT VARIANTS (for different configurations) ==========
    hasVariants: {
      type: Boolean,
      default: false
    },
    variants: [{
      variantSku: String,              // Different SKU for variant
      configuration: String,           // e.g., "P Trap with Cintia seat cover"
      priceModifier: Number,           // Difference from base price
      colors: [String],                // Available colors for this variant
      stock: { type: Number, default: 0 },
      notes: String
    }],
    
    // ========== SET CONFIGURATION ==========
    // For products sold as sets (like Basin + Pedestal)
    isSet: {
      type: Boolean,
      default: false
    },
    setComponents: [{
      componentSku: String,
      componentName: String,
      componentPrice: Number,
      componentPurchasePrice: Number,
      isRequired: { type: Boolean, default: true },
      componentCategory: String,
      quantity: { type: Number, default: 1 }
    }],
    setPrice: {
      type: Number,
      default: 0
    },
    setSavings: {
      type: Number,
      default: 0
    },
    
    // ========== COMPONENT INFO ==========
    // If this product is part of a set
    isComponent: {
      type: Boolean,
      default: false
    },
    partOfSets: [{
      setSku: String,
      setName: String
    }],
    
    // ========== REQUIRED PARTS (for two-part systems) ==========
    // e.g., Concealed diverter requires both exposed and concealed parts
    requiresOtherParts: {
      type: Boolean,
      default: false
    },
    requiredParts: [{
      partType: String,              // "Concealed Part", "Exposed Part"
      partSku: String,
      partName: String,
      partPrice: Number,
      isIncludedInPrice: { type: Boolean, default: false }
    }],
    
    // ========== COMPATIBILITY & ACCESSORIES ==========
    compatibility: {
      type: String,
      trim: true,
      default: ''
    },
    compatibilityNotes: {
      type: String,
      trim: true,
      default: ''
    },
    
    // Optional compatible accessories
    compatibleAccessories: [{
      accessorySku: String,
      accessoryName: String,
      accessoryPrice: Number,
      accessoryCategory: String
    }],
    
    // Included accessories (like seat covers)
    includedAccessories: [{
      accessoryName: String,
      isIncludedInPrice: { type: Boolean, default: true }
    }],
    
    // ========== PHYSICAL ATTRIBUTES ==========
    dimensions: {
      type: String,
      trim: true,
      default: ''
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      default: 0
    },
    colors: [String],
    finish: {
      type: String,
      trim: true,
      default: ''
    },
    material: {
      type: String,
      trim: true,
      default: ''
    },
    variants_description: {
      type: String,
      trim: true,
      default: ''
    },
    
    // ========== CERTIFICATIONS & FEATURES ==========
    certifications: [String],
    features: [String],
    collection: {
      type: String,
      trim: true,
      default: ''
    },
    
    // ========== SUPPLY & LOGISTICS ==========
    supplier: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    warranty: {
      type: String,
      trim: true,
      default: ''
    },
    
    // ========== STATUS & TRACKING ==========
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    isDiscontinued: {
      type: Boolean,
      default: false
    },
    availableTillStocksLast: {
      type: Boolean,
      default: false
    },
    lastRestocked: {
      type: Date
    },
    lastSold: {
      type: Date
    },
    
    // ========== ADDITIONAL NOTES ==========
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    internalNotes: {
      type: String,
      trim: true,
      default: ''
    },
    
    // ========== IMAGES ==========
    images: [String]
  },
  {
    timestamps: true
  }
);

// ========== INDEXES FOR FAST SEARCH ==========
// Text index for search functionality
productSchema.index({ name: 'text', description: 'text', sku: 'text', productCodeSeries: 'text' });

// Compound indexes for common queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ productStructure: 1, isActive: 1 });

// ========== PRE-SAVE MIDDLEWARE ==========
// Calculate profit margin before saving
productSchema.pre('save', function (next) {
  if (this.isModified('purchasePrice') || this.isModified('sellingPrice')) {
    if (this.purchasePrice > 0) {
      this.profitMargin = ((this.sellingPrice - this.purchasePrice) / this.purchasePrice) * 100;
    } else {
      this.profitMargin = 0;
    }
  }
  next();
});

// ========== VIRTUAL FIELDS ==========
// Virtual field to check if stock is low
productSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

// Virtual field to get the display price range
productSchema.virtual('priceRange').get(function () {
  if (this.priceByColor && this.priceByColor.length > 0) {
    const prices = this.priceByColor.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return `₹${minPrice.toLocaleString('en-IN')}`;
    }
    return `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;
  }
  return `₹${this.sellingPrice.toLocaleString('en-IN')}`;
});

// Virtual field for product type display
productSchema.virtual('productTypeDisplay').get(function () {
  const typeMap = {
    'standalone': 'Single Product',
    'variant': 'Multiple Options Available',
    'set': 'Product Set (Multiple Items)',
    'component': 'Part of a Set',
    'two-part': 'Requires Additional Parts'
  };
  return typeMap[this.productStructure] || 'Single Product';
});

// Virtual field for complete product information (for quotations)
productSchema.virtual('completeInfo').get(function () {
  const info = {
    basicInfo: {
      sku: this.sku,
      name: this.name,
      category: this.category,
      productType: this.productType,
      brand: this.brand,
      description: this.description
    },
    pricing: {
      basePrice: this.sellingPrice,
      priceRange: this.priceRange,
      hasMultiplePrices: this.priceByColor && this.priceByColor.length > 0,
      colorPricing: this.priceByColor
    },
    structure: {
      type: this.productStructure,
      typeDisplay: this.productTypeDisplay,
      isSet: this.isSet,
      hasVariants: this.hasVariants,
      requiresOtherParts: this.requiresOtherParts
    },
    inventory: {
      stock: this.quantity,
      isLowStock: this.isLowStock,
      unit: this.unit
    }
  };

  // Add set components if this is a set
  if (this.isSet && this.setComponents.length > 0) {
    info.setInfo = {
      components: this.setComponents,
      setPrice: this.setPrice,
      savings: this.setSavings
    };
  }

  // Add required parts if this is a two-part system
  if (this.requiresOtherParts && this.requiredParts.length > 0) {
    info.requiredParts = this.requiredParts;
  }

  // Add variants if available
  if (this.hasVariants && this.variants.length > 0) {
    info.variants = this.variants;
  }

  // Add compatibility info
  if (this.compatibility || this.compatibilityNotes) {
    info.compatibility = {
      compatibility: this.compatibility,
      notes: this.compatibilityNotes,
      compatibleAccessories: this.compatibleAccessories,
      includedAccessories: this.includedAccessories
    };
  }

  // Add physical attributes
  if (this.dimensions || this.colors.length > 0) {
    info.attributes = {
      dimensions: this.dimensions,
      colors: this.colors,
      finish: this.finish,
      material: this.material,
      variants_description: this.variants_description,
      features: this.features,
      certifications: this.certifications
    };
  }

  return info;
});

// ========== INSTANCE METHODS ==========
// Method to get price for a specific color
productSchema.methods.getPriceForColor = function(color) {
  if (this.priceByColor && this.priceByColor.length > 0) {
    const colorPrice = this.priceByColor.find(p => 
      p.color.toLowerCase() === color.toLowerCase()
    );
    return colorPrice ? colorPrice.price : this.sellingPrice;
  }
  return this.sellingPrice;
};

// Method to get total set price
productSchema.methods.getTotalSetPrice = function() {
  if (!this.isSet || !this.setComponents.length) {
    return this.sellingPrice;
  }
  return this.setPrice || this.setComponents.reduce((total, comp) => 
    total + (comp.componentPrice * (comp.quantity || 1)), 0
  );
};

// Method to calculate total price for two-part systems
productSchema.methods.getTotalPriceWithParts = function() {
  let total = this.sellingPrice;
  if (this.requiresOtherParts && this.requiredParts.length > 0) {
    this.requiredParts.forEach(part => {
      if (!part.isIncludedInPrice) {
        total += part.partPrice;
      }
    });
  }
  return total;
};

// Method to check if product is available
productSchema.methods.isAvailable = function() {
  return this.isActive && !this.isDiscontinued && this.quantity > 0;
};

// Method to get user-friendly summary
productSchema.methods.getUserFriendlySummary = function() {
  let summary = `${this.name} (${this.sku})`;
  
  if (this.isSet) {
    summary += ` - Complete Set with ${this.setComponents.length} items`;
  } else if (this.requiresOtherParts) {
    summary += ` - Requires ${this.requiredParts.length} additional part(s)`;
  } else if (this.hasVariants) {
    summary += ` - Available in ${this.variants.length} configuration(s)`;
  }
  
  if (this.priceByColor && this.priceByColor.length > 0) {
    summary += ` | ${this.priceByColor.length} color options`;
  }
  
  if (this.availableTillStocksLast) {
    summary += ` ⚠️ Available Till Stocks Last`;
  }
  
  return summary;
};

// ========== ENSURE VIRTUALS ARE INCLUDED ==========
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;

