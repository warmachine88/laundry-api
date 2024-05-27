const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.get('/getAll', bookingController.getAllBookings);
router.post('/add', bookingController.addBooking);
router.delete('/delete/:id', bookingController.deleteBooking);
router.put('/edit/:id', bookingController.updateBooking);

module.exports = router;
