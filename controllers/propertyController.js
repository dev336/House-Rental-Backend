import Property from '../models/Property.js';
import Review from '../models/Review.js';
import { validationResult } from 'express-validator';

export const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const prop = await Property.create({ ...req.body, ownerID: req.user.id });
    res.status(201).json(prop);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const listProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, q, available } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(`^${city}$`, 'i');
    if (available) filter.availabilityStatus = available;
    if (minPrice || maxPrice) filter.rentPrice = {};
    if (minPrice) filter.rentPrice.$gte = Number(minPrice);
    if (maxPrice) filter.rentPrice.$lte = Number(maxPrice);
    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { address: new RegExp(q, 'i') }
      ];
    }
    const props = await Property.find(filter).populate('ownerID','name email');
    res.json(props);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getProperty = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id).populate('ownerID','name email');
    if (!prop) return res.status(404).json({ message: 'Property not found' });
    res.json(prop);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const prop = await Property.findOne({ _id: req.params.id, ownerID: req.user.id });
    if (!prop) return res.status(404).json({ message: 'Property not found or not yours' });
    Object.assign(prop, req.body);
    await prop.save();
    res.json(prop);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const prop = await Property.findOneAndDelete({ _id: req.params.id, ownerID: req.user.id });
    if (!prop) return res.status(404).json({ message: 'Property not found or not yours' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateAverageRating = async (propertyID) => {
  const stats = await Review.aggregate([
    { $match: { propertyID } },
    { $group: { _id: '$propertyID', avg: { $avg: '$rating' } } }
  ]);
  const avg = stats.length ? Number(stats[0].avg.toFixed(2)) : 0;
  await Property.findByIdAndUpdate(propertyID, { averageRating: avg });
};
