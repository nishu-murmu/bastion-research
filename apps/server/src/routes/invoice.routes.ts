import { Router } from "express";
import {
  downloadInvoice,
  getMyInvoices,
} from "../controllers/invoice.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// User invoices
router.get("/invoices", protect, getMyInvoices);
router.get("/invoices/:id", protect, downloadInvoice);

export default router;



