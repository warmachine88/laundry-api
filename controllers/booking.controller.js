const Booking = require('../models/bookings.model');

// Define controller methods
const bookingController = {
  ensureTableExists: async () => {
    try {
      await Booking.sync();
      console.log('Booking table is ready.');
    } catch (error) {
      console.error('Error syncing booking table:', error);
    }
  },
  // Method to fetch all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.findAll();
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Method to add a new booking
  addBooking: async (req, res) => {
    try {
      const newBooking = await Booking.create(req.body);
      res.status(201).json({ message: 'Booking created', booking: newBooking });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Method to delete a booking
  deleteBooking: async (req, res) => {
    const bookingId = req.params.id;
    try {
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      await booking.destroy();
      res.json({ message: 'Booking deleted' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Method to update a booking
  updateBooking: async (req, res) => {
    const bookingId = req.params.id;
    try {
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      await booking.update(req.body);
      res.json({ message: 'Booking updated', booking });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Ensure the booking table exists
bookingController.ensureTableExists().then(() => {
  console.log('Booking table check completed.');
}).catch(error => {
  console.error('Error checking booking table:', error);
});

module.exports = bookingController;