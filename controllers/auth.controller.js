const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification error:', err.message);
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  },

  generateAccessToken: (username) => {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1h' }); // Adjust expiry time as needed
  },
  
  generateRandomToken: () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    return hashResetToken;
  }
};
