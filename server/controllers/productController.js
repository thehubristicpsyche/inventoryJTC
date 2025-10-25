import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku?.toUpperCase() });
    if (existingProduct) {
      return errorResponse(res, 409, 'SKU already exists');
    }

    const product = await Product.create(productData);
    return successResponse(res, 201, 'Product created successfully', { product });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      collection,
      active,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (collection) {
      query.collection = collection;
    }

    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    if (search) {
      // Partial/fuzzy search - matches anywhere in SKU, name, or category
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive
      query.$or = [
        { sku: searchRegex },
        { name: searchRegex },
        { category: searchRegex },
        { productCodeSeries: searchRegex }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Products retrieved successfully', {
      products,
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

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product retrieved successfully', { product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if updating SKU and if it already exists
    if (updateData.sku) {
      const existingProduct = await Product.findOne({
        sku: updateData.sku.toUpperCase(),
        _id: { $ne: id }
      });
      
      if (existingProduct) {
        return errorResponse(res, 409, 'SKU already exists');
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product updated successfully', { product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product deleted successfully', { product });
  } catch (error) {
    next(error);
  }
};

export const adjustQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustment, reason } = req.body;

    if (typeof adjustment !== 'number') {
      return errorResponse(res, 400, 'Adjustment must be a number');
    }

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    const newQuantity = product.quantity + adjustment;

    if (newQuantity < 0) {
      return errorResponse(
        res,
        400,
        `Cannot adjust quantity. Resulting quantity (${newQuantity}) would be negative.`
      );
    }

    product.quantity = newQuantity;
    await product.save();

    console.log(`Quantity adjusted for product ${product.sku}: ${adjustment} (Reason: ${reason || 'Not provided'})`);

    return successResponse(res, 200, 'Product quantity adjusted successfully', { product });
  } catch (error) {
    next(error);
  }
};

export const getProductStats = async (req, res, next) => {
  try {
    // Get total products count
    const totalProducts = await Product.countDocuments({});

    // Get active products count
    const activeProducts = await Product.countDocuments({ isActive: true });

    // Get low stock products using aggregation
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    });

    // Get total inventory value using aggregation
    const totalValueResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ['$sellingPrice', '$quantity'] }
          }
        }
      }
    ]);

    const totalValue = totalValueResult.length > 0 ? totalValueResult[0].totalValue : 0;

    // Get categories breakdown
    const categoriesResult = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const categories = categoriesResult.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return successResponse(res, 200, 'Product statistics retrieved successfully', {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalValue,
      categories
    });
  } catch (error) {
    next(error);
  }
};

