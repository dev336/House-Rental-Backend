import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, me, listUsers } from '../controllers/authController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/signup',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin','owner','renter']),
  signup
);

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  login
);

router.get('/me', auth, me);
router.get('/users', auth, authorize('admin'), listUsers);

export default router;
