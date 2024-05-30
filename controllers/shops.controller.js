const Shops = require('../models/shops.model');

// Controller functions for Shops model

// Get all shops
exports.getAllShops = async (req, res) => {
  try {
    console.log('Getting all shops...');
    const shops = await Shops.findAll();
    console.log(`Found ${shops.length} shops.`);
    res.json(shops);
  } catch (error) {
    console.error('Error getting shops:', error);
    if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ message: 'Database error. Please try again later.' });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: 'Invalid request. Please check your input.', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Get a single shop by ID
exports.getShopById = async (req, res) => {
  try {
    console.log(`Getting shop with ID ${req.params.id}...`);
    const shop = await Shops.findByPk(req.params.id);
    if (!shop) {
      console.log(`Shop with ID ${req.params.id} not found.`);
      res.status(404).json({ message: 'Shop not found' });
    } else {
      console.log(`Found shop with ID ${req.params.id}.`);
      res.json(shop);
    }
  } catch (error) {
    console.error(`Error getting shop with ID ${req.params.id}:`, error);
    if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ message: 'Database error. Please try again later.' });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: 'Invalid request. Please check your input.', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Create a new shop
exports.createShop = async (req, res) => {
    try {
      console.log('Creating a new shop...');
  
      // Extract and validate the input
      const { name, logo, tagline, location, facebook, services, contact } = req.body;
  
      if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required fields.' });
      }
  
      // Ensure services and contact are correctly formatted as JSON strings
      const formattedServices = Array.isArray(services) ? JSON.stringify(services) : services;
      const formattedContact = typeof contact === 'object' ? JSON.stringify(contact) : contact;
  
      // Create the shop
      const shop = await Shops.create({
        name,
        logo,
        tagline,
        location,
        facebook,
        services: formattedServices,
        contact: formattedContact
      });
  
      console.log(`Created shop with ID ${shop.id}.`);
      res.status(201).json(shop);
    } catch (error) {
      console.error('Error creating shop:', error);
  
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ message: 'Invalid request. Please check your input.', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };
  
  

// Update a shop
exports.updateShop = async (req, res) => {
  try {
    console.log(`Updating shop with ID ${req.params.id}...`);
    const shop = await Shops.findByPk(req.params.id);
    if (!shop) {
      console.log(`Shop with ID ${req.params.id} not found.`);
      res.status(404).json({ message: 'Shop not found' });
    } else {
      await shop.update(req.body);
      console.log(`Updated shop with ID ${shop.id}.`);
      res.json(shop);
    }
  } catch (error) {
    console.error(`Error updating shop with ID ${req.params.id}:`, error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: 'Invalid request. Please check your input.', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Delete a shop
exports.deleteShop = async (req, res) => {
  try {
    console.log(`Deleting shop with ID ${req.params.id}...`);
    const shop = await Shops.findByPk(req.params.id);
    if (!shop) {
      console.log(`Shop with ID ${req.params.id} not found.`);
      res.status(404).json({ message: 'Shop not found' });
    } else {
      await shop.destroy();
      console.log(`Deleted shop with ID ${shop.id}.`);
      res.status(204).send();
    }
  } catch (error) {
    console.error(`Error deleting shop with ID ${req.params.id}:`, error);
    if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ message: 'Database error. Please try again later.' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};