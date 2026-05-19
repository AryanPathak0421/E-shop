const XLSX = require('xlsx');
const Papa = require('papaparse');

const Product = require('../models/Product');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, priceMin, priceMax, search, page = 1, limit = 12 } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};


exports.bulkUploadProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
      return res.status(400).json({ error: 'Only Excel (.xlsx) and CSV files are supported' });
    }

    let products = [];

    if (isExcel) {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      products = XLSX.utils.sheet_to_json(worksheet);
    } else if (isCSV) {
      const csvText = fileBuffer.toString('utf8');
      products = await new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error),
        });
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'No valid products found in the file' });
    }

    const results = {
      totalRows: products.length,
      successCount: 0,
      failureCount: 0,
      errors: [],
      insertedProducts: [],
    };

    for (let i = 0; i < products.length; i++) {
      const row = products[i];
      const rowNum = i + 2; // Row number in spreadsheet

      try {
        // Validate required fields
        if (!row.name || !row.price || !row.category) {
          results.errors.push({
            row: rowNum,
            error: 'Missing required fields: name, price, category',
          });
          results.failureCount++;
          continue;
        }

        // Validate price
        const price = Number(row.price);
        if (isNaN(price) || price < 0) {
          results.errors.push({
            row: rowNum,
            error: 'Invalid price value',
          });
          results.failureCount++;
          continue;
        }

        // Validate stock
        const stock = Number(row.stock) || 0;
        if (stock < 0) {
          results.errors.push({
            row: rowNum,
            error: 'Invalid stock value',
          });
          results.failureCount++;
          continue;
        }

        // Create product
        const product = await Product.create({
          name: row.name.trim(),
          description: row.description || 'No description provided',
          price,
          category: row.category.trim(),
          stock,
          imageUrl: row.imageUrl || null,
          sku: row.sku || null,
        });

        results.insertedProducts.push({
          id: product._id,
          name: product.name,
          price: product.price,
        });
        results.successCount++;
      } catch (error) {
        results.errors.push({
          row: rowNum,
          productName: row.name || 'Unknown',
          error: error.message,
        });
        results.failureCount++;
      }
    }

    res.json({
      success: true,
      message: `Bulk upload completed. ${results.successCount} products inserted, ${results.failureCount} failed.`,
      results,
    });
  } catch (error) {
    next(error);
  }
};