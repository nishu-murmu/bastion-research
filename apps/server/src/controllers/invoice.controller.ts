import { Request, Response } from "express";
import {
  getInvoiceById,
  listAllInvoices,
  listUserInvoices,
} from "../services/invoice.service";

export const getMyInvoices = async (req: Request, res: Response) => {
  try {
    const user: any = (req as any).user;
    if (!user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const invoices = await listUserInvoices(user.id as string);
    return res.status(200).json(invoices);
  } catch (error: any) {
    console.error("Error fetching user invoices:", error);
    return res.status(500).json({
      message: "Failed to fetch invoices",
      error: error?.message,
    });
  }
};

export const adminGetAllInvoices = async (_req: Request, res: Response) => {
  try {
    const invoices = await listAllInvoices();
    return res.status(200).json(invoices);
  } catch (error: any) {
    console.error("Error fetching admin invoices:", error);
    return res.status(500).json({
      message: "Failed to fetch invoices",
      error: error?.message,
    });
  }
};

export const downloadInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Invoice id is required" });
    }

    const invoice = await getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (!invoice.invoice_pdf_url) {
      return res
        .status(404)
        .json({ message: "Invoice PDF URL not available yet" });
    }

    // For now, respond with the URL so frontend can open/download it.
    return res.status(200).json({
      id: invoice.id,
      zoho_invoice_id: invoice.zoho_invoice_id,
      url: invoice.invoice_pdf_url,
    });
  } catch (error: any) {
    console.error("Error preparing invoice download:", error);
    return res.status(500).json({
      message: "Failed to prepare invoice download",
      error: error?.message,
    });
  }
};



