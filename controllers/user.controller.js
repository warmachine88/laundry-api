const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const emailController = require('./email.controller');
const authController = require('./auth.controller');

module.exports = {
  ensureTableExists: async () => {
    try {
      const tableExists = await User.sequelize.getQueryInterface().showAllTables();
      if (!tableExists.includes('user_tbl')) {
        await User.sync();
        console.log('User table created successfully.');
      } else {
        console.log('User table already exists.');
      }
    } catch (error) {
      console.error('Error ensuring table exists:', error);
    }
  },

  login: async (req, res) => {
    try {
      await module.exports.ensureTableExists();
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Incorrect Username', status: 401 });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Incorrect Password', status: 401 });
      }
      const token = authController.generateAccessToken({ username: email });
      const userProfile = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        contact_no: user.contact_no,
        type: user.type
      };
      res.status(200).json({ token, userProfile });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getUserByToken: async (req, res) => {
    try {
      await module.exports.ensureTableExists();
      const { token } = req.body;
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid or expired token', status: 401 });
        }
        res.status(200).json({ user });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  signUp: async (req, res) => {
    const { firstname, lastname, email, type, password, contact_no } = req.body;
    try {
      await module.exports.ensureTableExists();
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        firstname,
        lastname,
        email,
        type,
        password: hash,
        contact_no
      });
      res.status(201).json({ message: 'Created successfully', id: newUser.id });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      await module.exports.ensureTableExists();
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found', status: 404 });
      }
      const resetToken = authController.generateRandomToken();
      const tokenExpiration = Date.now() + 3600000;
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = tokenExpiration;
      await user.save();
      const emailSent = await emailController.sendPasswordResetEmail(user.email, resetToken, user);
      if (emailSent) {
        res.status(200).json({ message: 'Email sent successfully', status: 200 });
      } else {
        res.status(500).send('Error sending email');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      await module.exports.ensureTableExists();
      const resetToken = req.params.id;
      const { newPassword } = req.body;
      const user = await User.findOne({ where: { resetPasswordToken: resetToken } });
      if (!user || user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired token', status: 400 });
      }
      const isMatch = await bcrypt.compare(newPassword, user.password);
      if (isMatch) {
        return res.status(400).json({ message: 'The previous password and the new password must be different.', status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      res.status(200).json({ message: 'Password reset successfully', status: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updatePassword: async (req, res) => {
    try {
      await module.exports.ensureTableExists();
      const { email, oldPassword, newPassword } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid user email', status: 400 });
      }
      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        return res.status(404).json({ message: 'Invalid old password', status: 404 });
      }
      const isMatch = await bcrypt.compare(newPassword, user.password);
      if (isMatch) {
        return res.status(400).json({ message: 'The previous password and the new password must be different.', status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.status(200).json({ message: 'Update your password successfully', status: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getAll: async (req, res) => {
    try {
      await module.exports.ensureTableExists();
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getById: async (req, res) => {
    try {
      await module.exports.ensureTableExists();
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'No data found', status: 404 });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const { id } = req.params;
      const { firstname, lastname, email, type, contact_no } = req.body;
      const [updatedRows] = await User.update({
        firstname,
        lastname,
        email,
        type,
        contact_no
      }, {
        where: { id }
      });
      if (updatedRows === 0) {
        return res.status(404).json({ message: 'No data found to update', status: 404 });
      }
      res.status(200).json({ message: 'Update successfully', status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRows = await User.destroy({ where: { id } });
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'No data found to delete', status: 404 });
      }
      res.status(200).json({ message: 'Deleted successfully', status: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  deleteAll: async (req, res) => {
    try {
      const deletedRows = await User.destroy({ where: {} });
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'No data found to delete', status: 404 });
      }
      res.status(200).json({ message: 'Deleted all data successfully', status: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting data');
    }
  },
};
