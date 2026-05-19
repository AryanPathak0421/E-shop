# MERN E-Commerce Platform - Complete Setup & Installation Guide

## 📋 Project Overview

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform with:
- **Customer Dashboard**: Browse products, add to cart, checkout, view orders
- **Admin Panel**: Manage products, inventory, orders, and bulk uploads
- **AI Chatbot**: Google Gemini-powered chatbot for customer support
- **Secure Authentication**: JWT-based auth with role-based access control

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- Git

### Installation Steps

#### 1. **Clone/Setup Project**
```bash
cd Roam_MyWay
```

#### 2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

#### 3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
cd ..
```

#### 4. **Configure Environment Variables**

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials:
# - MONGODB_URI: Your MongoDB connection string
# - GEMINI_API_KEY: Your Google Gemini API key
# - JWT_SECRET: Random secure string
# - Other variables as needed
```

**Frontend (.env.local)** (Create if needed)
```bash
cd ../frontend
# Frontend uses API_URL from vite.config.js (http://localhost:5000/api)
```

#### 5. **Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📁 Project Structure

```
Roam_MyWay/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── chatRoutes.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   └── chatController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validators.js
│   │   ├── services/
│   │   │   ├── chatService.js
│   │   │   └── productService.js
│   │   ├── utils/
│   │   │   └── geminiHelper.js
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   ├── customer/
    │   │   ├── admin/
    │   │   └── shared/
    │   ├── pages/
    │   │   ├── customer/
    │   │   ├── admin/
    │   │   └── auth/
    │   ├── redux/
    │   ├── services/
    │   ├── hooks/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── index.html
```

---

## 🔑 Key Features

### Customer Features
✅ User registration and login
✅ Browse products with filters (category, price range, search)
✅ Detailed product pages
✅ Shopping cart with add/remove/quantity management
✅ Persistent cart (localStorage + Redux)
✅ Checkout with shipping address
✅ Order placement and history
✅ AI Chatbot for support

### Admin Features
✅ Admin dashboard with statistics
✅ Complete product CRUD operations
✅ Inventory management
✅ Order tracking and status updates
✅ Bulk product upload (CSV/Excel)
✅ CSV/Excel file parsing with validation
✅ Per-row error reporting
✅ Partial upload support

### Security Features
✅ JWT-based authentication
✅ bcryptjs password hashing
✅ Role-based access control
✅ Protected API routes
✅ Protected frontend routes
✅ Input validation (express-validator)
✅ Rate limiting on chat API
✅ CORS configuration

### AI Chatbot Features
✅ Floating chat button (bottom-right)
✅ Message history and conversation tracking
✅ Intent detection (product search, stock check, etc.)
✅ Real database queries for accuracy
✅ Gemini API integration
✅ Typing animations and loading states
✅ Graceful error handling
✅ Rate limiting to prevent abuse

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/categories` | Get all categories |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/products/bulk-upload` | Bulk upload products (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart (protected) |
| POST | `/api/cart/add` | Add item to cart (protected) |
| PUT | `/api/cart/update` | Update item quantity (protected) |
| DELETE | `/api/cart/:productId` | Remove item (protected) |
| DELETE | `/api/cart` | Clear cart (protected) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order (protected) |
| GET | `/api/orders/user/orders` | Get user orders (protected) |
| GET | `/api/orders/:id` | Get order by ID (protected) |
| GET | `/api/orders` | Get all orders (admin) |
| PUT | `/api/orders/:id` | Update order status (admin) |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send chat message (rate limited) |

---

## 🔐 Environment Variables

### Backend (.env)
```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# AI
GEMINI_API_KEY=your_google_gemini_api_key

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📝 Sample Data for Testing

### Test Admin Account
```
Email: admin@eshop.com
Password: admin123
```

### Test Customer Account
```
Email: customer@eshop.com
Password: customer123
```

### Sample CSV for Bulk Upload
```
name,price,description,category,stock,imageUrl
Wireless Headphones,79.99,High quality wireless headphones,Electronics,50,https://example.com/headphones.jpg
Running Shoes,99.99,Comfortable running shoes for athletes,Footwear,30,https://example.com/shoes.jpg
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Follow Vercel deployment instructions
# Update API URL in vite.config.js to production backend
```

### Backend (Render/Railway)
```bash
# Push code to GitHub
# Connect repository to Render or Railway
# Set environment variables in deployment platform
# Database: Use MongoDB Atlas
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Google Generative AI** - Chatbot
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting

---

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/customer),
  phone: String,
  address: { street, city, state, zipCode, country },
  isActive: Boolean,
  timestamps
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  imageUrl: String,
  images: [String],
  rating: Number,
  sku: String,
  isActive: Boolean,
  timestamps
}
```

### Order
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    price: Number
  }],
  shippingAddress: { street, city, state, zipCode, country, phone },
  totalAmount: Number,
  paymentStatus: String (pending/completed/failed),
  orderStatus: String (pending/confirmed/shipped/delivered),
  paymentMethod: String,
  timestamps
}
```

---

## 🤖 Chatbot Intent Types

The chatbot can handle:
1. **Product Search** - Find products by keywords
2. **Stock Availability** - Check if products are in stock
3. **Price Range Search** - Find products within a budget
4. **Category Listing** - List all available categories
5. **Product Details** - Get information about specific products
6. **Order Help** - Guide on how to place orders
7. **Policy Questions** - Answer general store questions

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify connection string in .env
- Check IP whitelist on MongoDB Atlas
- Ensure database exists

### CORS Errors
- Check `CORS_ORIGIN` in backend .env
- Ensure frontend URL matches exactly
- Clear browser cache

### Gemini API Errors
- Verify API key is correct
- Check API is enabled in Google Cloud
- Ensure valid quota available

### Port Already in Use
- Backend: `lsof -i :5000` then `kill -9 <PID>`
- Frontend: `lsof -i :5173` then `kill -9 <PID>`

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Google Generative AI API](https://ai.google.dev)

---

## 📄 License

MIT License

---

## 🤝 Support

For issues and questions, please refer to the documentation or create an issue in the repository.

Happy coding! 🎉
