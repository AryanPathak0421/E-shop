const Product = require('../models/Product');
const Order = require('../models/Order');

const INTENTS = {
  SEARCH_PRODUCTS: 'search_products',
  CHECK_STOCK: 'check_stock',
  GET_CATEGORIES: 'get_categories',
  GET_PRODUCT_DETAILS: 'get_product_details',
  PRICE_RANGE: 'price_range',
  HELP: 'help',
  CHECK_ORDERS: 'check_orders',
  STORE_POLICIES: 'store_policies',
  UNKNOWN: 'unknown',
};

const KEYWORDS = {
  search: ['search', 'find', 'look for', 'show me', 'list', 'browse'],
  stock: ['stock', 'available', 'in stock', 'out of stock', 'have any', 'do you have'],
  categories: ['categories', 'what do you sell', 'types', 'departments', 'sections'],
  details: ['details', 'description', 'tell me about', 'info on', 'features'],
  price: ['price', 'cost', 'expensive', 'cheap', 'cheapest', 'affordable', 'under', 'below'],
  help: ['help', 'assistance', 'guide', 'how to buy', 'how to order'],
  orders: ['order', 'my order', 'track', 'status', 'purchase history', 'bought'],
  policies: ['return policy', 'refund', 'warranty', 'shipping cost', 'policies', 'returns'],
};

exports.detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();

  // Check order queries first to avoid overlap
  if (KEYWORDS.orders.some((kw) => lowerMessage.includes(kw))) {
    return INTENTS.CHECK_ORDERS;
  }

  // Check store policies next
  if (KEYWORDS.policies.some((kw) => lowerMessage.includes(kw))) {
    return INTENTS.STORE_POLICIES;
  }

  for (const [intent, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some((kw) => lowerMessage.includes(kw))) {
      if (intent === 'search') return INTENTS.SEARCH_PRODUCTS;
      if (intent === 'stock') return INTENTS.CHECK_STOCK;
      if (intent === 'categories') return INTENTS.GET_CATEGORIES;
      if (intent === 'details') return INTENTS.GET_PRODUCT_DETAILS;
      if (intent === 'price') return INTENTS.PRICE_RANGE;
      if (intent === 'help') return INTENTS.HELP;
    }
  }

  return INTENTS.UNKNOWN;
};

exports.executeQuery = async (intent, message, userId) => {
  try {
    const lowerMessage = message.toLowerCase();

    switch (intent) {
      case INTENTS.SEARCH_PRODUCTS: {
        // Look for price limits, e.g. "under 50" or "under $50" or "below 100"
        let priceLimit = null;
        const priceMatch = lowerMessage.match(/(?:under|below|less than)\s*\$?\s*(\d+)/i);
        if (priceMatch) {
          priceLimit = parseFloat(priceMatch[1]);
        }

        // Clean up keywords to search for
        const ignoreWords = ['search', 'find', 'show', 'me', 'for', 'a', 'the', 'some', 'products', 'items', 'under', 'below', 'less', 'than', 'costing'];
        const keywords = lowerMessage
          .split(' ')
          .filter((w) => !ignoreWords.includes(w) && isNaN(w));

        const query = { isActive: true };
        if (priceLimit !== null) {
          query.price = { $lte: priceLimit };
        }

        if (keywords.length > 0) {
          query.$or = [
            { name: { $regex: keywords.join('|'), $options: 'i' } },
            { category: { $regex: keywords.join('|'), $options: 'i' } },
            { description: { $regex: keywords.join('|'), $options: 'i' } }
          ];
        }

        const products = await Product.find(query).limit(5);
        return exports.formatResults('products', products);
      }

      case INTENTS.CHECK_STOCK: {
        const cleanWords = lowerMessage
          .replace(/(?:is|in|stock|available|do you have|have any|of|on|for|the|a)/gi, '')
          .trim();

        if (cleanWords) {
          // Look up specific product
          const product = await Product.findOne({
            name: { $regex: cleanWords, $options: 'i' },
            isActive: true
          });
          if (product) {
            return `Product: ${product.name}, Price: $${product.price}, Stock Status: ${product.stock > 0 ? `${product.stock} available` : 'OUT OF STOCK'}, Category: ${product.category}`;
          }
        }
        
        // Fallback: list all in-stock products
        const products = await Product.find({ stock: { $gt: 0 }, isActive: true }).limit(5);
        return exports.formatResults('in_stock', products);
      }

      case INTENTS.GET_PRODUCT_DETAILS: {
        const cleanWords = lowerMessage
          .replace(/(?:tell me about|info on|details of|description of|features of|what is|the|a)/gi, '')
          .trim();

        if (cleanWords) {
          const product = await Product.findOne({
            name: { $regex: cleanWords, $options: 'i' },
            isActive: true
          });
          if (product) {
            return `Product Details - Name: ${product.name}, Category: ${product.category}, Price: $${product.price}, Description: ${product.description}, Stock: ${product.stock} items left.`;
          }
        }

        // Fallback: list some popular products
        const products = await Product.find({ isActive: true }).limit(3);
        return exports.formatResults('products', products);
      }

      case INTENTS.GET_CATEGORIES: {
        const categories = await Product.distinct('category', { isActive: true });
        return `Available categories: ${categories.length > 0 ? categories.join(', ') : 'None currently configured'}`;
      }

      case INTENTS.PRICE_RANGE: {
        const products = await Product.find({ isActive: true }).sort({ price: 1 }).limit(5);
        return exports.formatResults('products', products);
      }

      case INTENTS.CHECK_ORDERS: {
        if (!userId) {
          return 'UNAUTHENTICATED';
        }
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(3);
        if (!orders || orders.length === 0) {
          return 'You have not placed any orders yet.';
        }
        return orders
          .map((order, idx) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            const itemsList = order.items
              .map((item) => `${item.productName || 'Product'} (Qty: ${item.quantity})`)
              .join(', ');
            return `Order #${idx + 1} - Status: ${order.orderStatus}, Payment Status: ${order.paymentStatus}, Total Amount: $${order.totalAmount}, Placed On: ${date}, Items: [${itemsList}]`;
          })
          .join('\n');
      }

      case INTENTS.STORE_POLICIES: {
        return `Store policies:
- Refund/Return Policy: We offer a standard 30-day refund/return window for all unused items in their original packaging.
- Shipping Policy: Standard shipping is free on orders above $50. Standard deliveries take 3-5 business days. Express shipping is available for a flat rate of $15.
- Warranty: All products are covered under a 1-year manufacturer warranty from the date of purchase.`;
      }

      case INTENTS.HELP: {
        return `How to place an order:
1. Browse products and click "Add to Cart" on the item(s) you like.
2. Click the Shopping Cart icon to review items, adjust quantities, and view the running total.
3. Click "Checkout", fill in your shipping address, review the summary, and confirm your order.
4. You can track your orders by asking me "Where is my order?" or viewing your order history page.`;
      }

      default:
        return 'I can assist you with product availability, prices, categories, details, store policies, or tracking your orders.';
    }
  } catch (error) {
    console.error('Query execution error:', error);
    return 'Unable to fetch data from database';
  }
};

exports.formatResults = (type, data) => {
  if (!data || data.length === 0) {
    return 'No products found.';
  }

  if (type === 'products' || type === 'in_stock') {
    return data
      .map(
        (p) =>
          `Product: ${p.name}, Price: $${p.price}, Stock: ${p.stock}, Category: ${p.category}`
      )
      .join('\n');
  }

  return JSON.stringify(data);
};