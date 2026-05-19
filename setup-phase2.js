#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
  'backend/src/config',
  'backend/src/models',
  'backend/src/routes',
  'backend/src/controllers',
  'backend/src/middleware',
  'backend/src/services',
  'backend/src/utils',
  'backend/uploads',
  'frontend/src/components/common',
  'frontend/src/components/customer',
  'frontend/src/components/admin',
  'frontend/src/components/shared',
  'frontend/src/pages/customer',
  'frontend/src/pages/admin',
  'frontend/src/pages/auth',
  'frontend/src/redux/slices',
  'frontend/src/services',
  'frontend/src/hooks',
  'frontend/src/utils',
  'frontend/public',
];

console.log('Creating directories...');
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  try {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created: ${dir}`);
  } catch (e) {
    // Directory already exists
  }
});

// Backend Controller Files
const controllerFiles = {
  'backend/src/controllers/authController.js': `const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    user = new User({
      name,
      email,
      password,
      role: role || 'customer',
    });

    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};`,

  'backend/src/controllers/productController.js': `const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: products.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};`,

  'backend/src/controllers/cartController.js': `const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.price });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ error: 'Item not in cart' });
    }

    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};`,

  'backend/src/controllers/orderController.js': `const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const order = new Order({
      userId: req.user.id,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        productName: item.productId.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.totalPrice,
      shippingAddress,
    });

    await order.save();

    // Update product stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, { items: [], totalPrice: 0 });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId').sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find()
      .populate('userId')
      .populate('items.productId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');
    
    const total = await Order.countDocuments();

    res.json({
      success: true,
      orders,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, paymentStatus },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};`,
};

// Routes Files
const routeFiles = {
  'backend/src/routes/authRoutes.js': `const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidator, loginValidator } = require('../middleware/validators');

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/me', protect, authController.me);

module.exports = router;`,

  'backend/src/routes/productRoutes.js': `const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { productValidator } = require('../middleware/validators');

router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);
router.post('/', protect, authorize('admin'), productValidator, productController.createProduct);
router.put('/:id', protect, authorize('admin'), productValidator, productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;`,

  'backend/src/routes/cartRoutes.js': `const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart);
router.post('/remove', protect, cartController.removeFromCart);
router.put('/quantity', protect, cartController.updateCartItemQuantity);
router.delete('/', protect, cartController.clearCart);

module.exports = router;`,

  'backend/src/routes/orderRoutes.js': `const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getUserOrders);
router.get('/admin/all', protect, authorize('admin'), orderController.getAllOrders);
router.put('/:id', protect, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;`,
};

// Services Files
const serviceFiles = {
  'backend/src/services/uploadService.js': `const xlsx = require('xlsx');
const csv = require('papaparse');
const Product = require('../models/Product');

exports.parseBulkProducts = async (file, fileType) => {
  try {
    const data = file.buffer.toString('utf-8');
    let products = [];

    if (fileType === 'xlsx') {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      products = xlsx.utils.sheet_to_json(sheet);
    } else if (fileType === 'csv') {
      return new Promise((resolve, reject) => {
        csv.parse(data, {
          header: true,
          complete: (results) => {
            products = results.data.filter(p => p.name);
            resolve(products);
          },
          error: (error) => reject(error),
        });
      });
    }

    return products;
  } catch (error) {
    throw new Error('File parsing failed: ' + error.message);
  }
};

exports.insertProducts = async (products) => {
  const results = [];

  for (let i = 0; i < products.length; i++) {
    try {
      const product = new Product({
        name: products[i].name,
        price: parseFloat(products[i].price),
        description: products[i].description || '',
        category: products[i].category || 'Uncategorized',
        stock: parseInt(products[i].stock) || 0,
        imageUrl: products[i].imageUrl || '',
        sku: products[i].sku || \`SKU-\${Date.now()}-\${i}\`,
      });

      const saved = await product.save();
      results.push({
        rowIndex: i,
        status: 'success',
        productId: saved._id,
      });
    } catch (error) {
      results.push({
        rowIndex: i,
        status: 'error',
        error: error.message,
      });
    }
  }

  return results;
};`,

  'backend/src/services/chatService.js': `const { GoogleGenerativeAI } = require('google-generative-ai');
const Product = require('../models/Product');
const Order = require('../models/Order');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const detectIntent = (message) => {
  const msg = message.toLowerCase();
  const keywords = {
    stock: ['stock', 'available', 'in stock', 'quantity', 'how many'],
    price: ['price', 'cost', 'cheap', 'expensive', 'discount'],
    product: ['product', 'item', 'what', 'which', 'details'],
    category: ['category', 'categories', 'types', 'kind'],
    order: ['order', 'buy', 'purchase', 'checkout', 'shipping'],
    policy: ['policy', 'return', 'warranty', 'refund', 'shipping cost'],
  };

  for (let [intent, words] of Object.entries(keywords)) {
    if (words.some(word => msg.includes(word))) {
      return intent;
    }
  }
  return 'general';
};

exports.getChatResponse = async (message, userId) => {
  try {
    const intent = detectIntent(message);
    let context = '';

    if (intent === 'stock') {
      const products = await Product.find({}, 'name stock price');
      context = \`Available products: \${JSON.stringify(products)}\`;
    } else if (intent === 'price') {
      const products = await Product.find({}, 'name price').sort({ price: 1 }).limit(5);
      context = \`Products by price: \${JSON.stringify(products)}\`;
    } else if (intent === 'category') {
      const categories = await Product.distinct('category');
      context = \`Available categories: \${categories.join(', ')}\`;
    } else if (intent === 'order' && userId) {
      const orders = await Order.find({ userId }).limit(3);
      context = \`User order history: \${JSON.stringify(orders)}\`;
    } else if (intent === 'product') {
      const products = await Product.find({}).limit(5);
      context = \`Popular products: \${JSON.stringify(products)}\`;
    } else if (intent === 'policy') {
      context = 'Store policy: We offer free shipping on orders above \$50, 30-day return policy, and 1-year warranty on all products.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = \`You are a helpful e-commerce assistant. Based on the context provided, answer the user's question.
Context: \${context}
User Message: \${message}
Provide a helpful, concise response.\`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      message: text,
      intent,
    };
  } catch (error) {
    return {
      success: false,
      message: 'I apologize, but I cannot process your request at the moment. Please try again later or contact our support team.',
      intent: 'error',
      error: error.message,
    };
  }
};`,
};

// Write all files
console.log('\nWriting controller files...');
Object.entries(controllerFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(`✓ Created: ${filePath}`);
});

console.log('\nWriting route files...');
Object.entries(routeFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(`✓ Created: ${filePath}`);
});

console.log('\nWriting service files...');
Object.entries(serviceFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(`✓ Created: ${filePath}`);
});

console.log('\n✓ All files created successfully!');
