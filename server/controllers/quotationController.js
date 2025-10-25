import Quotation from '../models/Quotation.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Create new quotation
export const createQuotation = async (req, res, next) => {
  try {
    const quotationData = req.body;
    quotationData.createdBy = req.user._id;

    // Set default valid until date (30 days from now)
    if (!quotationData.validUntil) {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      quotationData.validUntil = validUntil;
    }

    // Validate and enrich line items with product details
    if (quotationData.lineItems && quotationData.lineItems.length > 0) {
      for (let item of quotationData.lineItems) {
        const product = await Product.findById(item.product);
        if (!product) {
          return errorResponse(res, 404, `Product with ID ${item.product} not found`);
        }
        
        // Auto-fill product details if not provided
        item.productCode = item.productCode || product.sku;
        item.productName = item.productName || product.name;
        item.productType = item.productType || product.productStructure;
        item.unitPrice = item.unitPrice || product.sellingPrice;
      }
    }

    const quotation = await Quotation.create(quotationData);
    
    // Populate references
    await quotation.populate('createdBy', 'fullName email');
    await quotation.populate('lineItems.product', 'name sku category');

    return successResponse(res, 201, 'Quotation created successfully', { quotation });
  } catch (error) {
    next(error);
  }
};

// Get all quotations with filters
export const getAllQuotations = async (req, res, next) => {
  try {
    const {
      status,
      customer,
      dateFrom,
      dateTo,
      search,
      sort = 'quotationDate',
      order = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (customer) {
      query.$or = [
        { 'customer.name': new RegExp(customer, 'i') },
        { 'customer.email': new RegExp(customer, 'i') },
        { 'customer.companyName': new RegExp(customer, 'i') }
      ];
    }

    if (dateFrom || dateTo) {
      query.quotationDate = {};
      if (dateFrom) query.quotationDate.$gte = new Date(dateFrom);
      if (dateTo) query.quotationDate.$lte = new Date(dateTo);
    }

    if (search) {
      query.$or = [
        { quotationNumber: new RegExp(search, 'i') },
        { 'customer.name': new RegExp(search, 'i') },
        { referenceNumber: new RegExp(search, 'i') }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    // Execute query
    const [quotations, total] = await Promise.all([
      Quotation.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'fullName email')
        .populate('lineItems.product', 'name sku'),
      Quotation.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Quotations retrieved successfully', {
      quotations,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get quotation statistics
export const getQuotationStats = async (req, res, next) => {
  try {
    const totalQuotations = await Quotation.countDocuments({});
    const draftQuotations = await Quotation.countDocuments({ status: 'draft' });
    const sentQuotations = await Quotation.countDocuments({ status: 'sent' });
    const approvedQuotations = await Quotation.countDocuments({ status: 'approved' });

    // Calculate total values by status
    const valueByStatus = await Quotation.aggregate([
      {
        $group: {
          _id: '$status',
          totalValue: { $sum: '$grandTotal' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent quotations
    const recentQuotations = await Quotation.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'fullName email')
      .select('quotationNumber customer.name status grandTotal quotationDate');

    return successResponse(res, 200, 'Quotation statistics retrieved successfully', {
      totalQuotations,
      draftQuotations,
      sentQuotations,
      approvedQuotations,
      valueByStatus,
      recentQuotations
    });
  } catch (error) {
    next(error);
  }
};

// Get single quotation by ID
export const getQuotationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findById(id)
      .populate('createdBy', 'fullName email')
      .populate('lineItems.product')
      .populate('statusHistory.changedBy', 'fullName email');

    if (!quotation) {
      return errorResponse(res, 404, 'Quotation not found');
    }

    return successResponse(res, 200, 'Quotation retrieved successfully', { quotation });
  } catch (error) {
    next(error);
  }
};

// Update quotation
export const updateQuotation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return errorResponse(res, 404, 'Quotation not found');
    }

    // Check if quotation can be edited
    if (quotation.status !== 'draft' && quotation.status !== 'sent') {
      return errorResponse(res, 400, 'Only draft or sent quotations can be edited');
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'quotationNumber' && key !== 'createdBy') {
        quotation[key] = updateData[key];
      }
    });

    await quotation.save();

    await quotation.populate('createdBy', 'fullName email');
    await quotation.populate('lineItems.product', 'name sku category');

    return successResponse(res, 200, 'Quotation updated successfully', { quotation });
  } catch (error) {
    next(error);
  }
};

// Update quotation status
export const updateQuotationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return errorResponse(res, 404, 'Quotation not found');
    }

    // Validate status transition
    const validTransitions = {
      draft: ['sent'],
      sent: ['approved', 'rejected', 'draft'],
      approved: ['converted'],
      rejected: [],
      expired: [],
      converted: []
    };

    if (!validTransitions[quotation.status].includes(status)) {
      return errorResponse(res, 400, `Cannot change status from ${quotation.status} to ${status}`);
    }

    quotation.updateStatus(status, req.user._id, notes);
    await quotation.save();

    return successResponse(res, 200, 'Quotation status updated successfully', { quotation });
  } catch (error) {
    next(error);
  }
};

// Delete quotation (soft delete for draft only)
export const deleteQuotation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return errorResponse(res, 404, 'Quotation not found');
    }

    if (quotation.status !== 'draft') {
      return errorResponse(res, 400, 'Only draft quotations can be deleted');
    }

    await Quotation.findByIdAndDelete(id);

    return successResponse(res, 200, 'Quotation deleted successfully', { quotation });
  } catch (error) {
    next(error);
  }
};

// Duplicate quotation
export const duplicateQuotation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const originalQuotation = await Quotation.findById(id);

    if (!originalQuotation) {
      return errorResponse(res, 404, 'Quotation not found');
    }

    // Create duplicate with modified data
    const duplicateData = originalQuotation.toObject();
    delete duplicateData._id;
    delete duplicateData.quotationNumber;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.statusHistory;
    delete duplicateData.emailHistory;
    delete duplicateData.pdfGenerated;

    duplicateData.status = 'draft';
    duplicateData.quotationDate = new Date();
    duplicateData.createdBy = req.user._id;
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    duplicateData.validUntil = validUntil;

    const newQuotation = await Quotation.create(duplicateData);

    await newQuotation.populate('createdBy', 'fullName email');
    await newQuotation.populate('lineItems.product', 'name sku category');

    return successResponse(res, 201, 'Quotation duplicated successfully', { quotation: newQuotation });
  } catch (error) {
    next(error);
  }
};

// Add line item to quotation
export const addLineItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lineItemData = req.body;

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return errorResponse(res, 404, 'Quotation not found');
    }

    if (quotation.status !== 'draft') {
      return errorResponse(res, 400, 'Can only add line items to draft quotations');
    }

    // Validate product exists
    const product = await Product.findById(lineItemData.product);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    // Enrich line item data
    lineItemData.productCode = lineItemData.productCode || product.sku;
    lineItemData.productName = lineItemData.productName || product.name;
    lineItemData.productType = lineItemData.productType || product.productStructure;
    lineItemData.unitPrice = lineItemData.unitPrice || product.sellingPrice;

    quotation.addLineItem(lineItemData);
    await quotation.save();

    await quotation.populate('lineItems.product', 'name sku category');

    return successResponse(res, 200, 'Line item added successfully', { quotation });
  } catch (error) {
    next(error);
  }
};

// Update line item
export const updateLineItem = async (req, res, next) => {
  try {
    const { id, lineItemId } = req.params;
    const updateData = req.body;

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return errorResponse(res, 404, 'Quotation not found');
    }

    if (quotation.status !== 'draft') {
      return errorResponse(res, 400, 'Can only update line items in draft quotations');
    }

    const lineItem = quotation.lineItems.id(lineItemId);

    if (!lineItem) {
      return errorResponse(res, 404, 'Line item not found');
    }

    // Update line item fields
    Object.keys(updateData).forEach(key => {
      lineItem[key] = updateData[key];
    });

    // Recalculate line item totals
    lineItem.lineSubtotal = lineItem.unitPrice * lineItem.quantity;

    if (lineItem.discountType === 'percentage') {
      lineItem.lineTotal = lineItem.lineSubtotal - (lineItem.lineSubtotal * lineItem.discountValue / 100);
    } else if (lineItem.discountType === 'fixed') {
      lineItem.lineTotal = lineItem.lineSubtotal - lineItem.discountValue;
    } else {
      lineItem.lineTotal = lineItem.lineSubtotal;
    }

    await quotation.save();

    return successResponse(res, 200, 'Line item updated successfully', { quotation });
  } catch (error) {
    next(error);
  }
};

// Delete line item
export const deleteLineItem = async (req, res, next) => {
  try {
    const { id, lineItemId } = req.params;

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return errorResponse(res, 404, 'Quotation not found');
    }

    if (quotation.status !== 'draft') {
      return errorResponse(res, 400, 'Can only delete line items from draft quotations');
    }

    quotation.lineItems.pull(lineItemId);
    await quotation.save();

    return successResponse(res, 200, 'Line item deleted successfully', { quotation });
  } catch (error) {
    next(error);
  }
};





