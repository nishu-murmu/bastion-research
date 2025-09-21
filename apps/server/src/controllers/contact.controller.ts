import { Request, Response } from "express";
import sendEmail from "../utils/email";
import { supabase } from "../supabase";

const CONTACT_EMAIL_KEY = "contact_recipient_email";

const getRecipient = async (): Promise<string> => {
  const fallback = process.env.CONTACT_RECIPIENT_EMAIL || process.env.SMTP_DEFAULT_TO || "connect@bastionresearch.in";
  try {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", CONTACT_EMAIL_KEY)
      .maybeSingle();
    return data?.value || fallback;
  } catch {
    return fallback;
  }
};

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, category, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: "name, email and message are required" });
    }

    const to = await getRecipient();

    const safe = (v: any) => (v ? String(v) : "-");

    const subject = `[Contact] ${safe(category)} - ${safe(name)}`;
    const text = `New contact submission\n\nName: ${safe(name)}\nEmail: ${safe(email)}\nPhone: ${safe(phone)}\nCategory: ${safe(category)}\n\nMessage:\n${safe(message)}\n`;
    const html = `<h3>New contact submission</h3>
      <p><strong>Name:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Phone:</strong> ${safe(phone)}</p>
      <p><strong>Category:</strong> ${safe(category)}</p>
      <p><strong>Message:</strong><br/>${String(safe(message)).replace(/\n/g, "<br/>")}</p>`;

    await sendEmail({ to, subject, text, html });

    return res.status(200).json({ message: "Message sent" });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to send message" });
  }
};

