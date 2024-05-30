const Shops = require('../models/shops.model');

// Controller functions for Shops model

// Get all shops
exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shops.findAll();
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single shop by ID
exports.getShopById = async (req, res) => {
    try {
        const shop = await Shops.findByPk(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        const shop = await Shops.create(req.body);
        res.status(201).json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a shop
exports.updateShop = async (req, res) => {
    try {
        const shop = await Shops.findByPk(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        await shop.update(req.body);
        res.json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a shop
exports.deleteShop = async (req, res) => {
    try {
        const shop = await Shops.findByPk(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        await shop.destroy();
        res.json({ message: 'Shop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
