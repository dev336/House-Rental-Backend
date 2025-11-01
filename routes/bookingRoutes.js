import { Router } from 'express';
import { body } from 'express-validator';
import { auth, authorize } from '../middleware/auth.js';
import { createBooking, myBookings, approveBooking, payBooking, cancelBooking } from '../controllers/bookingController.js';

const router = Router();

router.post('/',
  auth, authorize('renter'),
  body('propertyID').notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  createBooking
);

router.get('/mine', auth, myBookings);
router.patch('/:id/approve', auth, authorize('owner','admin'), approveBooking);
router.patch('/:id/pay', auth, authorize('renter'), payBooking);
router.delete('/:id', auth, cancelBooking);

export default router;
