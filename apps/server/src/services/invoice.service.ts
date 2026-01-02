import { supabase } from "../supabase";

export type InvoiceRecord = {
  id?: string;
  user_id: string;
  plan_id: number | null;
  zoho_customer_id: string;
  zoho_invoice_id: string;
  invoice_pdf_url: string | null;
  status: string;
  transaction_id?: string | null;
  created_at?: string;
};

export const createInvoiceRecord = async (
  payload: InvoiceRecord
): Promise<InvoiceRecord | null> => {
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      user_id: payload.user_id,
      plan_id: payload.plan_id,
      zoho_customer_id: payload.zoho_customer_id,
      zoho_invoice_id: payload.zoho_invoice_id,
      invoice_pdf_url: payload.invoice_pdf_url,
      status: payload.status,
      transaction_id: payload.transaction_id ?? null,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Failed to create invoice record:", error);
    return null;
  }

  return data as InvoiceRecord | null;
};

export const listUserInvoices = async (userId: string) => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      id,
      user_id,
      plan_id,
      zoho_customer_id,
      zoho_invoice_id,
      invoice_pdf_url,
      status,
      transaction_id,
      created_at,
      users!invoices_user_id_fkey ( email, first_name, last_name ),
      membership_plans!invoices_plan_id_fkey ( plan_id, plan_name, price_amount, currency )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to list user invoices:", error);
    throw new Error(error.message);
  }

  const rows = (data as any[]) || [];
  return rows.map((r: any) => {
    const user = r?.users || {};
    const plan = r?.membership_plans || {};
    return {
      id: r.id,
      user_id: r.user_id,
      plan_id: r.plan_id,
      zoho_customer_id: r.zoho_customer_id,
      zoho_invoice_id: r.zoho_invoice_id,
      invoice_pdf_url: r.invoice_pdf_url,
      status: r.status,
      transaction_id: r.transaction_id,
      created_at: r.created_at,
      user_email: user.email || null,
      user_name:
        [user.first_name, user.last_name].filter(Boolean).join(" ") || null,
      plan_name: plan.plan_name || null,
      amount: plan.price_amount ?? null,
      currency: plan.currency || "INR",
    };
  });
};

export const listAllInvoices = async () => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      id,
      user_id,
      plan_id,
      zoho_customer_id,
      zoho_invoice_id,
      invoice_pdf_url,
      status,
      transaction_id,
      created_at,
      users!invoices_user_id_fkey ( email, first_name, last_name ),
      membership_plans!invoices_plan_id_fkey ( plan_id, plan_name, price_amount, currency )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to list invoices:", error);
    throw new Error(error.message);
  }

  const rows = (data as any[]) || [];
  return rows.map((r: any) => {
    const user = r?.users || {};
    const plan = r?.membership_plans || {};
    return {
      id: r.id,
      user_id: r.user_id,
      plan_id: r.plan_id,
      zoho_customer_id: r.zoho_customer_id,
      zoho_invoice_id: r.zoho_invoice_id,
      invoice_pdf_url: r.invoice_pdf_url,
      status: r.status,
      transaction_id: r.transaction_id,
      created_at: r.created_at,
      user_email: user.email || null,
      user_name:
        [user.first_name, user.last_name].filter(Boolean).join(" ") || null,
      plan_name: plan.plan_name || null,
      amount: plan.price_amount ?? null,
      currency: plan.currency || "INR",
    };
  });
};

export const getInvoiceById = async (id: string) => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      id,
      user_id,
      plan_id,
      zoho_customer_id,
      zoho_invoice_id,
      invoice_pdf_url,
      status,
      transaction_id,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch invoice by id:", error);
    throw new Error(error.message);
  }

  return data as InvoiceRecord | null;
};



