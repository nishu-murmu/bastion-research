import axios from 'axios'

const AISENSY_ENDPOINT = 'https://backend.aisensy.com/campaign/t1/api/v2'

export type AiSensyCampaignPayload = {
  destination: string
  userName: string
  source?: string
  templateParams?: string[]
  tags?: string[]
  attributes?: Record<string, string>
}

function normalizeDestinationPhone(input: string) {
  // AiSensy accepts numbers with or without country code. We just remove obvious formatting.
  return (input || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/[-().]/g, '')
}

export async function sendAiSensyCampaign(payload: AiSensyCampaignPayload) {
  const apiKey = process.env.AISENSY_API_KEY
  const campaignName = process.env.AISENSY_CAMPAIGN_NAME

  if (!apiKey || !campaignName) {
    return { sent: false, skipped: true, reason: 'missing_env' as const }
  }

  const destination = normalizeDestinationPhone(payload.destination)
  const userName = (payload.userName || '').trim()

  if (!destination || !userName) {
    return { sent: false, skipped: true, reason: 'invalid_payload' as const }
  }

  const { data } = await axios.post(
    AISENSY_ENDPOINT,
    {
      apiKey,
      campaignName,
      destination,
      userName,
      source: payload.source,
      templateParams: payload.templateParams,
      tags: payload.tags,
      attributes: payload.attributes,
    },
    {
      timeout: 10_000,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return { sent: true, skipped: false, data }
}

