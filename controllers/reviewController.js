import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import { validationResult } from 'express-validator';
import { updateAverageRating } from './propertyController.js';

export const addReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { propertyID, rating, comment } = req.body;
    // Ensure user booked this property before reviewing
    const hasBooking = await Booking.findOne({ propertyID, renterID: req.user.id, status: 'approved' });
    if (!hasBooking) return res.status(400).json({ message: 'You must have an approved booking to review' });
    const review = await Review.create({ propertyID, renterID: req.user.id, rating, comment });
    await updateAverageRating(review.propertyID);
    res.status(201).json(review);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const listPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ propertyID: req.params.propertyId }).populate('renterID','name');
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    const isOwner = String(review.renterID) === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!(isOwner || isAdmin)) return res.status(403).json({ message: 'Not allowed' });
    await review.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
