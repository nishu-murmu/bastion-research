import { supabase } from "../supabase";
import {
  sendMonthlySubscriptionExpirySummaryEmail,
  sendSubscriptionExpiryReminderEmail,
} from "../services/emailNotification.service";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MONTHLY_SUMMARY_RECIPIENT =
  process.env.MONTHLY_SUBSCRIPTION_EXPIRY_REPORT_EMAIL ||
  "subscription@bastionresearch.in";

type ExpiringUserRow = {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  subscription_end_date?: string | null;
  membership_plans?: {
    plan_name?: string | null;
  } | null;
};

const getTargetDateString = () => {
  const target = new Date();
  target.setDate(target.getDate() + 7);
  return target.toISOString().split("T")[0];
};

export const runSubscriptionExpiryReminder = async () => {
  const targetDate = getTargetDateString();
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        first_name,
        subscription_end_date,
        membership_plans (
          plan_name
        )
      `
      )
      .eq("subscription_end_date", targetDate)
      .eq("status", "active");

    if (error) {
      console.error("Failed to fetch expiring subscriptions", error);
      return;
    }

    const rows = (data ?? []) as ExpiringUserRow[];
    if (rows.length === 0) {
      console.info(
        `No subscriptions ending on ${targetDate}; reminder run complete.`
      );
      return;
    }

    for (const user of rows) {
      if (!user?.email || !user?.subscription_end_date) continue;
      const firstNameValue = user.first_name;
      const firstName =
        typeof firstNameValue === "string" ? firstNameValue : undefined;
      const planNameValue = user.membership_plans?.plan_name;
      let planName: string | undefined = undefined;
      if (typeof planNameValue === "string") {
        planName = planNameValue;
      }
      await sendSubscriptionExpiryReminderEmail({
        to: user.email,
        firstName,
        planName,
        subscriptionEndDate: user.subscription_end_date,
      });
      console.info(
        `Sent expiry reminder to ${user.email} for ${user.subscription_end_date}`
      );
    }
  } catch (error) {
    console.error("Subscription reminder job failed", error);
  }
};

const getUtcMonthWindow = (reference: Date) => {
  const year = reference.getUTCFullYear();
  const month = reference.getUTCMonth();
  const start = new Date(Date.UTC(year, month, 1));
  const next = new Date(Date.UTC(year, month + 1, 1));
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: next.toISOString().split("T")[0],
    label: start.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
};

const getMonthKey = (reference: Date) =>
  `${reference.getUTCFullYear()}-${reference.getUTCMonth()}`;

let lastMonthlySummaryMonthKey: string | null = null;

export const runMonthlySubscriptionExpirySummary = async (
  referenceDate: Date = new Date()
) => {
  if (!MONTHLY_SUMMARY_RECIPIENT) {
    console.info("Monthly expiry summary recipient is not configured.");
    return;
  }

  const { startDate, endDate, label } = getUtcMonthWindow(referenceDate);
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        first_name,
        last_name,
        subscription_end_date,
        membership_plans (
          plan_name
        )
      `
      )
      .gte("subscription_end_date", startDate)
      .lt("subscription_end_date", endDate)
      .eq("status", "active")
      .order("subscription_end_date", { ascending: true });

    if (error) {
      console.error("Failed to fetch monthly expiring subscriptions", error);
      return;
    }

    const rows = (data ?? []) as ExpiringUserRow[];
    const entries = rows
      .filter((row) => typeof row.email === "string")
      .map((row) => {
        const planNameValue = row.membership_plans?.plan_name;
        return {
          email: row.email!,
          firstName: typeof row.first_name === "string" ? row.first_name : null,
          lastName: typeof row.last_name === "string" ? row.last_name : null,
          planName: typeof planNameValue === "string" ? planNameValue : null,
          subscriptionEndDate: row.subscription_end_date ?? null,
        };
      });

    await sendMonthlySubscriptionExpirySummaryEmail({
      to: MONTHLY_SUMMARY_RECIPIENT,
      monthLabel: label,
      entries,
    });

    console.info(
      `Monthly subscription expiry summary for ${label} sent to ${MONTHLY_SUMMARY_RECIPIENT}.`
    );
  } catch (error) {
    console.error("Monthly subscription summary job failed", error);
  }
};

let scheduled = false;
let lastRunDay: string | null = null;

export const startSubscriptionExpiryReminderJob = () => {
  if (scheduled || process.env.NODE_ENV === "test") return;
  scheduled = true;

  const execute = async () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    if (lastRunDay === today) {
      console.info("Subscription reminder already ran today.");
      return;
    }
    lastRunDay = today;
    await runSubscriptionExpiryReminder();

    const monthKey = getMonthKey(now);
    if (now.getUTCDate() === 1 && lastMonthlySummaryMonthKey !== monthKey) {
      lastMonthlySummaryMonthKey = monthKey;
      await runMonthlySubscriptionExpirySummary(now);
    }
  };

  execute();
  setInterval(() => {
    execute().catch((error) => {
      console.error("Subscription reminder scheduler error", error);
    });
  }, ONE_DAY_MS);
};
