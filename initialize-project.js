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
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created: ${dir}`);
  }
});

console.log('✓ All directories created successfully!');

// Files to create - Backend
const backendFiles = {
  'backend/.env.example': `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_jwt_secret_key_make_it_long_and_random
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100`,

  'backend/package.json': JSON.stringify({
    name: 'ecommerce-backend',
    version: '1.0.0',
    description: 'MERN e-commerce platform backend',
    main: 'src/server.js',
    scripts: {
      start: 'node src/server.js',
      dev: 'nodemon src/server.js'
    },
    dependencies: {
      'axios': '^1.6.0',
      'bcryptjs': '^2.4.3',
      'cors': '^2.8.5',
      'dotenv': '^16.3.1',
      'express': '^4.18.2',
      'express-rate-limit': '^7.1.5',
      'express-validator': '^7.0.0',
      'google-generative-ai': '^0.1.3',
      'helmet': '^7.1.0',
      'jsonwebtoken': '^9.1.2',
      'mongoose': '^8.0.0',
      'multer': '^1.4.5-lts.1',
      'papaparse': '^5.4.1',
      'xlsx': '^0.18.5'
    },
    devDependencies: {
      'nodemon': '^3.0.2'
    }
  }, null, 2),

  'backend/src/config/database.js': `require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    return conn;
  } catch (error) {
    console.error(\`Error connecting to MongoDB: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;`,

  'backend/src/models/User.js': `const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);`,

  'backend/src/models/Product.js': `const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0,
    },
    imageUrl: String,
    images: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, name: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);`,

  'backend/src/models/Cart.js': `const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);`,

  'backend/src/models/Order.js': `const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'wallet'],
      default: 'credit_card',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);`,
};

// Middleware files
const middlewareFiles = {
  'backend/src/middleware/authMiddleware.js': `const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'User role is not authorized to access this route' });
    }
    next();
  };
};`,

  'backend/src/middleware/errorHandler.js': `const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  const errorResponse = {
    success: false,
    error: err.message || 'Server Error',
  };
  if (err.name === 'ValidationError') {
    errorResponse.error = Object.values(err.errors).map(e => e.message).join(', ');
    return res.status(400).json(errorResponse);
  }
  if (err.code === 11000) {
    errorResponse.error = \`\${Object.keys(err.keyPattern)[0]} already exists\`;
    return res.status(400).json(errorResponse);
  }
  if (err.name === 'JsonWebTokenError') {
    errorResponse.error = 'Invalid token';
    return res.status(401).json(errorResponse);
  }
  res.status(err.statusCode || 500).json(errorResponse);
};

module.exports = errorHandler;`,

  'backend/src/middleware/validators.js': `const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

exports.productValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  handleValidationErrors,
];`,
};

// Write backend files
console.log('\nWriting backend files...');
Object.entries(backendFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(`✓ Created: ${filePath}`);
});

console.log('\nWriting middleware files...');
Object.entries(middlewareFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(`✓ Created: ${filePath}`);
});

console.log('\n✓ All files created successfully!');
console.log('\nNext steps:');
console.log('1. cd backend');
console.log('2. npm install');
console.log('3. Create .env file (copy from .env.example)');
console.log('4. npm run dev');
