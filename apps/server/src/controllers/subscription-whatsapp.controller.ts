import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { sendAiSensyCampaign } from '../services/aisensy.service'

const reminderConfigByType: Record<
  string,
  { reminderLabel: string; campaignName: string }
> = {
  one_week_before: {
    reminderLabel: '1 week before subscription expiry',
    campaignName: 'Bastion CORE Renewal Reminder #1',
  },
  expiry_day: {
    reminderLabel: 'subscription expiry day',
    campaignName: 'Bastion CORE Renewal Reminder #2',
  },
  one_week_after: {
    reminderLabel: '1 week after subscription expiry',
    campaignName: 'Bastion CORE Renewal Reminder #3',
  },
  fifteen_days_after: {
    reminderLabel: '15 days after subscription expiry',
    campaignName: 'Bastion CORE Renewal Reminder #4',
  },
}

export const sendSubscriptionWhatsappReminder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const reminderType = String(req.body?.reminderType || '').trim()
    const requestCampaignName = String(req.body?.campaignName || '').trim()
    const reminderConfig = reminderConfigByType[reminderType]

    if (!reminderConfig) {
      return res.status(400).json({ message: 'Invalid reminderType' })
    }

    if (requestCampaignName !== reminderConfig.campaignName) {
      return res.status(400).json({ message: 'Invalid campaignName for reminderType' })
    }

    const user = req.user
    const phone = String(user?.phone || '').trim()
    const name =
      [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() ||
      user?.username ||
      'User'
    const subscriptionEndDate = String(user?.subscription_end_date || '').trim()

    if (!phone || !subscriptionEndDate) {
      return res.status(400).json({
        message: 'User phone and subscription_end_date are required',
      })
    }

    const result = await sendAiSensyCampaign({
      destination: phone,
      userName: name,
      campaignName: requestCampaignName,
      source: 'subscription-expiry-reminder',
      templateParams: [name, subscriptionEndDate, reminderConfig.reminderLabel],
      tags: ['subscription-expiry-reminder', reminderType],
      attributes: {
        user_id: String(user.id),
        email: String(user.email || ''),
        reminder_type: reminderType,
        subscription_end_date: subscriptionEndDate,
      },
    })

    return res.status(200).json(result)
  } catch (e: any) {
    return res
      .status(500)
      .json({ message: e?.message || 'Failed to send WhatsApp reminder' })
  }
}
