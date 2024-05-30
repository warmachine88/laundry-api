const express = require('express');
const router = express.Router();
const shopsController = require('../controllers/shops.controller');

router.get('/get-all', shopsController.getAllShops);
router.get('/:id', shopsController.getShopById);
router.post('/add', shopsController.createShop);
router.patch('/:id', shopsController.updateShop);
router.delete('/:id', shopsController.deleteShop);

module.exports = router;
