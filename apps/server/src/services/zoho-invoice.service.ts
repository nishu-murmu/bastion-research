import axios, { AxiosRequestConfig } from "axios";
import { getAccessToken } from "./zoho-auth.service";

const DEFAULT_ZOHO_INVOICE_BASE_URL = "https://invoice.zoho.in/api/v3";

const getOrgId = () => {
  const orgId = process.env.ZOHO_ORG_ID;
  if (!orgId) {
    throw new Error("ZOHO_ORG_ID is not configured.");
  }
  return orgId;
};

const getBaseUrl = () =>
  process.env.ZOHO_INVOICE_BASE_URL || DEFAULT_ZOHO_INVOICE_BASE_URL;

const zohoClient = axios.create({
  baseURL: getBaseUrl(),
});

type ZohoContact = {
  contact_id: string;
  contact_name?: string;
  company_name?: string;
  email?: string;
};

type ZohoInvoice = {
  invoice_id: string;
  invoice_number?: string;
  status?: string;
  invoice_url?: string;
  // Some accounts expose a direct PDF URL, but we keep it optional.
  invoice_pdf_url?: string;
};

const zohoRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  const token = await getAccessToken();
  const orgId = getOrgId();

  const finalConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "X-com-zoho-invoice-organizationid": orgId,
      ...(config.headers || {}),
    },
    params: {
      ...(config.params || {}),
      organization_id: orgId,
    },
  };

  const { data } = await zohoClient.request<T>(finalConfig);
  return data;
};

export const findCustomerByEmail = async (
  email: string
): Promise<ZohoContact | null> => {
  if (!email) return null;

  const data = await zohoRequest<{
    contacts?: ZohoContact[];
  }>({
    method: "GET",
    url: "/contacts",
    params: {
      email_contains: email,
    },
  });

  const candidates = data?.contacts || [];
  return candidates[0] || null;
};

export const createCustomer = async (
  customerData: Record<string, any>
): Promise<ZohoContact> => {
  const data = await zohoRequest<{ contact: ZohoContact }>({
    method: "POST",
    url: "/contacts",
    data: customerData,
  });
  return data.contact;
};

export const createOrGetCustomer = async (params: {
  email: string;
  displayName?: string;
}): Promise<ZohoContact> => {
  const { email, displayName } = params;
  const existing = await findCustomerByEmail(email);
  if (existing) return existing;

  const payload = {
    contact_name: displayName || email,
    company_name: displayName || email,
    email,
  };

  return createCustomer(payload);
};

export const createInvoice = async (
  invoiceData: Record<string, any>
): Promise<ZohoInvoice> => {
  const data = await zohoRequest<{ invoice: ZohoInvoice }>({
    method: "POST",
    url: "/invoices",
    data: invoiceData,
  });
  return data.invoice;
};

export const getInvoicePDF = async (
  invoiceId: string
): Promise<{ pdfUrl: string | null }> => {
  if (!invoiceId) {
    throw new Error("invoiceId is required to fetch Zoho invoice PDF URL.");
  }

  const data = await zohoRequest<{ invoice: ZohoInvoice }>({
    method: "GET",
    url: `/invoices/${invoiceId}`,
  });

  const invoice = data.invoice;
  const pdfUrl =
    invoice.invoice_pdf_url ||
    invoice.invoice_url ||
    null;

  return { pdfUrl };
};



