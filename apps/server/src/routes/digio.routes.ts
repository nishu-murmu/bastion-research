import { Router } from 'express'
import multer from 'multer'
import {
  getDocumentDetails,
  downloadSignedDocument,
  cancelSignatureRequest,
  digioWebhook,
  initiateSignatureJSON,
  fetchIdCardDetails
} from '../controllers/digio.controller'

const router = Router()
const DIGIO_DISABLED = process.env.DIGIO_DISABLED === 'true' ? true : false
const upload = multer({ storage: multer.memoryStorage() })

// If disabled, short-circuit all Digio endpoints
if (DIGIO_DISABLED) {
  router.use((req, res) => {
    return res.status(503).json({ message: 'Digio is temporarily disabled' })
  })
} else {
  // Start a signature request by uploading a PDF (JSON with base64)
  // Send PDF as base64 in file_data field
  router.post("/esign/uploadjson", initiateSignatureJSON);

  // Document detail/status
  router.get('/esign/:documentId', getDocumentDetails)

  // Download signed copy
  router.get('/esign/:documentId/download', downloadSignedDocument)

  // Cancel signature request
  router.post('/esign/:documentId/cancel', cancelSignatureRequest)

  router.post('/kyc/get-client-details/:idCardType', fetchIdCardDetails)

  router.post('/webhook', digioWebhook)
}

export default router

