import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { validationResult } from 'express-validator';

export const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { propertyID, startDate, endDate } = req.body;
    const property = await Property.findById(propertyID);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const booking = await Booking.create({ propertyID, renterID: req.user.id, startDate, endDate });
    res.status(201).json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const myBookings = async (req, res) => {
  try {
    const role = req.user.role;
    let filter = {};
    if (role === 'renter') filter.renterID = req.user.id;
    if (role === 'owner') {
      const props = await Property.find({ ownerID: req.user.id }).select('_id');
      filter.propertyID = { $in: props.map(p => p._id) };
    }
    const bookings = await Booking.find(filter).populate('propertyID').populate('renterID','name email');
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyID');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.propertyID.ownerID) !== req.user.id) {
      return res.status(403).json({ message: 'Not your property' });
    }
    const { approvalStatus } = req.body;
    if (!['approved','rejected','pending'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid approvalStatus' });
    }
    booking.approvalStatus = approvalStatus;
    booking.status = approvalStatus === 'approved' ? 'approved' : (approvalStatus === 'rejected' ? 'rejected' : 'pending');
    await booking.save();
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const payBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.renterID) !== req.user.id) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    if (booking.approvalStatus !== 'approved') {
      return res.status(400).json({ message: 'Booking not approved yet' });
    }
    booking.paymentStatus = 'paid';
    await booking.save();
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyID');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const isRenter = String(booking.renterID) === req.user.id && req.user.role === 'renter';
    const isOwner = String(booking.propertyID.ownerID) === req.user.id && req.user.role === 'owner';
    const isAdmin = req.user.role === 'admin';
    if (!(isRenter || isOwner || isAdmin)) return res.status(403).json({ message: 'Not allowed' });
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
