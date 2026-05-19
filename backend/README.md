# E-Commerce Backend API

MERN stack backend with Express, MongoDB, JWT authentication, and AI chatbot integration.

## Setup

1. Install dependencies: `npm install`
2. Create .env file with the provided .env.example as template
3. Update MongoDB URI and other required configurations
4. Run: `npm run dev` for development

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- GET `/api/products/categories` - Get all categories
- POST `/api/products` - Create product (admin only)
- PUT `/api/products/:id` - Update product (admin only)
- DELETE `/api/products/:id` - Delete product (admin only)
- POST `/api/products/bulk-upload` - Bulk upload products (admin only)

### Cart
- GET `/api/cart` - Get user cart (protected)
- POST `/api/cart/add` - Add item to cart (protected)
- PUT `/api/cart/update` - Update cart item (protected)
- DELETE `/api/cart/:productId` - Remove item (protected)

### Orders
- POST `/api/orders` - Create order (protected)
- GET `/api/orders/user/orders` - Get user orders (protected)
- GET `/api/orders/:id` - Get order by ID (protected)
- GET `/api/orders` - Get all orders (admin only)
- PUT `/api/orders/:id` - Update order status (admin only)

### Chat
- POST `/api/chat/message` - Send chat message (rate limited)

## Environment Variables

See .env.example for complete list

## Key Features

- JWT-based authentication with role-based access control
- Product management with CRUD operations
- Shopping cart management
- Order creation and tracking
- Bulk product upload (CSV/XLSX)
- AI-powered chatbot with Gemini API
- Input validation and error handling
- Rate limiting for API endpoints