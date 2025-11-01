import { Router } from 'express';
import { body } from 'express-validator';
import { auth, authorize } from '../middleware/auth.js';
import { addReview, listPropertyReviews, deleteReview } from '../controllers/reviewController.js';

const router = Router();

router.post('/',
  auth, authorize('renter'),
  body('propertyID').notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isString(),
  addReview
);

router.get('/property/:propertyId', listPropertyReviews);
router.delete('/:id', auth, deleteReview);

export default router;
