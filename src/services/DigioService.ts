// DigioService.ts - Service class for Digio API integration

type IdCardType = "PAN" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENSE" | "CIN" | "DIN" | "UAADHAAR" | "UDYAMAADHAAR" | "FSSAI" | "GST" | "GST_ADVANCED" | "PAN_TO_GST";

interface FetchIdDataParams {
    id_no: string;
    name?: string;
    dob?: string;
    file_no?: string;
    unique_request_id?: string;
    is_advanced?: boolean;
}

class DigioService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = import.meta.env.VITE_DIGIO_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_DIGIO_CLIENT_SECRET;
    const environment = import.meta.env.VITE_DIGIO_ENVIRONMENT || 'sandbox';
    this.baseUrl = environment === 'sandbox'
      ? 'https://ext.digio.in:444'
      : 'https://api.digio.in';

    if (!this.clientId || !this.clientSecret) {
        console.error("Digio client ID or secret not found in environment variables.");
    }
  }

  private getAuthHeader(): string {
    const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
    return `Basic ${credentials}`;
  }

  private generateUniqueRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async fetchIdData(idCardType: IdCardType, params: FetchIdDataParams): Promise<any> {
    try {
        const unique_request_id = params.unique_request_id || this.generateUniqueRequestId();
        const body = { ...params, unique_request_id };

        const response = await fetch(`${this.baseUrl}/client/v4/apis/kyc/fetch_id_data/${idCardType}`, {
            method: 'POST',
            headers: {
                'Authorization': this.getAuthHeader(),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching ID card data:', error);
        throw error;
    }
  }
}

const digioServiceInstance = new DigioService();
export default digioServiceInstance;
