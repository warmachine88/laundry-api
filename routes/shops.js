const express = require('express');
const router = express.Router();
const shopsController = require('../controllers/shops.controller');

router.get('/shops', shopsController.getAllShops);
router.get('/shops/:id', shopsController.getShopById);
router.post('/shops', shopsController.createShop);
router.patch('/shops/:id', shopsController.updateShop);
router.delete('/shops/:id', shopsController.deleteShop);

module.exports = router;
