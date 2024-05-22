const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.addBooking);
router.delete('/:id', bookingController.deleteBooking);
router.put('/:id', bookingController.updateBooking);

module.exports = router;
