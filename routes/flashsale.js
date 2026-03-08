const express = require('express');
const router = express.Router();
const flashsaleController = require('../controllers/flashsaleController');
const { requireAdmin } = require('../middleware/auth');

// Tất cả routes đều yêu cầu admin
router.use(requireAdmin);

// GET /admin/flashsale - Trang quản lý flash sale
router.get('/', flashsaleController.index);

// POST /admin/flashsale/add - Thêm sản phẩm vào flash sale
router.post('/add', flashsaleController.addProduct);

// POST /admin/flashsale/update-config - Cập nhật cấu hình flash sale
router.post('/update-config', flashsaleController.updateConfig);

// POST /admin/flashsale/:id/remove - Xóa sản phẩm khỏi flash sale
router.post('/:id/remove', flashsaleController.removeProduct);

module.exports = router;
