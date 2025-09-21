import { Router } from 'express';
import { protect, admin } from '../middleware/auth.middleware';
import { getAnalyticsSummary } from '../controllers/analytics.controller';
import { getContactRecipientEmail, updateContactRecipientEmail } from '../controllers/settings.controller';

const router = Router();

// Example protected admin route
router.get('/dashboard', protect, admin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard' });
});

// Analytics summary for admin dashboard
router.get('/analytics/summary', protect, admin, getAnalyticsSummary);

// Settings: Contact recipient email
router.get('/settings/contact-email', protect, admin, getContactRecipientEmail);
router.put('/settings/contact-email', protect, admin, updateContactRecipientEmail);

export default router;
