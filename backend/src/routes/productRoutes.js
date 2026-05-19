const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { productValidator } = require('../middleware/validators');
const multer = require('multer');
const { bulkUploadProducts } = require('../controllers/productController');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

router.post('/', protect, authorize('admin'), productValidator, createProduct);
router.put('/:id', protect, authorize('admin'), productValidator, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/bulk-upload', protect, authorize('admin'), upload.single('file'), bulkUploadProducts);

module.exports = router;