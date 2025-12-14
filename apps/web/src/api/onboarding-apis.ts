import axiosInstance from "./axios";
import { endpoints } from "./endpoints";

export interface CashfreeOrderPayload {
  plan: string;
  customer_id: string;
  customer_email: string;
  customer_phone: string;
  source: "register" | "subscription" | string;
  is_free?: boolean;
  coupon_code?: string | null;
  discount_amount?: number;
  metadata?: Record<string, any>;
}

export interface ZeroAmountPaymentPayload extends Record<string, any> {
  plan_id: number;
  payer_email: string;
  role?: string;
  coupon_code?: string;
  user_id?: string;
}

export interface VerifyPanPayload {
  pan: string;
  name: string;
}

export interface OnboardingPayload {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address1?: string;
  address2?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  company?: string;
  panCard: string;
  panVerification: any;
  status?: string;
  role?: string;
  plan_id?: string;
}

// Types are kept broad where the components currently don't enforce strict shapes.
// You can tighten these later as needed.

// ---------- OTP ----------

export async function sendOtp(phone: string) {
  const { data } = await axiosInstance.post(endpoints.otp.send, {
    phone,
  });
  return data;
}

export async function verifyOtp(phone: string, otp: string) {
  const { data } = await axiosInstance.post(endpoints.otp.verify, {
    phone,
    otp,
  });
  return data;
}

export async function sendEmailOtp(email: string) {
  const { data } = await axiosInstance.post(endpoints.otp.sendEmail, {
    email,
  });
  return data;
}

// ---------- Cashfree Plans / Orders ----------

export async function fetchPlans(): Promise<Plan[]> {
  const { data } = await axiosInstance.get(endpoints.cashfree.plans);
  return data.plans || [];
}

export async function createCashfreeOrder(payload: CashfreeOrderPayload) {
  const { data } = await axiosInstance.post(endpoints.cashfree.orders, payload);
  return data;
}

export async function zeroAmountPayment(payload: ZeroAmountPaymentPayload) {
  const { data } = await axiosInstance.post(
    endpoints.auth.zeroAmountPayment,
    payload
  );
  return data;
}

// ---------- Cashfree Verification (PAN) ----------

/**
 * TEMPORARY BYPASS:
 * PAN verification is currently mocked on the client side so that the user
 * flow still looks like a real verification, but no PAN verification API
 * is actually called.
 *
 * To restore the real behaviour, replace the implementation below with:
 *
 *   const { data } = await axiosInstance.post(
 *     endpoints.cashfreeVerification.verifyPan,
 *     payload
 *   );
 *   return data;
 */
export async function verifyPan(payload: VerifyPanPayload) {
  // Simulate a small network delay so the UI still shows a "verifying" state.
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    referenceId: `PAN-MOCK-${Date.now()}`,
    valid: true,
    status: "SUCCESS",
    registeredName: payload.name,
    nameMatchScore: 100,
    message: "PAN verification temporarily bypassed (mocked success)",
  };
}

/**
 * TEMPORARY BYPASS:
 * PAN status checks are also mocked so that "Check status" continues to work
 * without hitting the PAN verification API.
 *
 * To restore the real behaviour, replace the implementation below with:
 *
 *   const { data } = await axiosInstance.get(
 *     endpoints.cashfreeVerification.panStatus(referenceId)
 *   );
 *   return data;
 */
export async function getPanStatus(referenceId: string | number) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    referenceId,
    valid: true,
    status: "SUCCESS",
    registeredName: "",
    nameMatchScore: 100,
    message: "PAN status check temporarily bypassed (mocked success)",
  };
}

// ---------- Onboarding Auth ----------

export async function createFreeAccount(payload: {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address1?: string;
  address2?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  company?: string;
  status?: string;
  role?: string;
  plan_id?: number;
}) {
  const { data } = await axiosInstance.post(endpoints.auth.onboard, payload);
  return data;
}

export async function startOnboarding(payload: OnboardingPayload) {
  const { data } = await axiosInstance.post(endpoints.auth.onboard, payload);
  return data;
}

// ---------- Digio E-sign ----------

export async function uploadDigioEsignJson(payload: {
  file_data: string;
  file_name: string;
  will_self_sign: boolean;
  include_authentication_url: boolean;
  signers: {
    identifier: string;
    name: string;
  }[];
}) {
  const { data } = await axiosInstance.post(
    endpoints.digio.esignUploadJson,
    payload
  );
  return data;
}

// ---------- Users ----------

export async function updateUser(id: string, payload: any) {
  const { data } = await axiosInstance.put(endpoints.users.update(id), payload);
  return data;
}

// ---------- Coupons ----------

export async function validateCoupon(code: string) {
  const { data } = await axiosInstance.get(
    `${endpoints.coupons.base}/validate`,
    {
      params: { code },
    }
  );
  return data;
}
