import { Router } from 'express';
import { body } from 'express-validator';
import { auth, authorize } from '../middleware/auth.js';
import { createProperty, listProperties, getProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js';

const router = Router();

router.get('/', listProperties);
router.get('/:id', getProperty);
router.post('/',
  auth, authorize('owner','admin'),
  body('title').notEmpty(),
  body('address').notEmpty(),
  body('rentPrice').isNumeric(),
  createProperty
);
router.patch('/:id', auth, authorize('owner','admin'), updateProperty);
router.delete('/:id', auth, authorize('owner','admin'), deleteProperty);

export default router;
