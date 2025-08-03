// DigioService.ts - Service class for Digio API integration

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
        // In a real app, you might want to handle this more gracefully
        console.error("Digio client ID or secret not found in environment variables.");
    }
  }

  // Generate Basic Auth header
  private getAuthHeader(): string {
    const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
    return `Basic ${credentials}`;
  }

  // Generate unique request ID
  private generateUniqueRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Main method to analyze ID card
  async analyzeIdCard(frontImage: File, backImage: File, options: Record<string, any> = {}): Promise<any> {
    try {
      const formData = new FormData();

      // Add required files
      formData.append('front_part', frontImage);
      formData.append('back_part', backImage);

      // Add unique request ID
      formData.append('unique_request_id', this.generateUniqueRequestId());

      // Add additional request options
      const defaultOptions = {
        features: ["MASK", "CROP_ALIGN", "VERIFY", "SIGNATURE_EXTRACT", "FACE_EXTRACT", "SECURITY_FEATURE"],
        expected_ids: ["AADHAAR", "PAN"],
        additional_checks: ["BLUR_IMAGE", "BLACK_AND_WHITE_IMAGE"]
      };

      const requestOptions = { ...defaultOptions, ...options };
      formData.append('additional_request', JSON.stringify(requestOptions));

      const response = await fetch(`${this.baseUrl}/v4/client/kyc/analyze/file/idcard`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error analyzing ID card:', error);
      throw error;
    }
  }

  // Helper method to validate file before upload
  validateFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!file) {
      throw new Error('File is required');
    }

    if (file.size > maxSize) {
      throw new Error('File size should be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and GIF files are allowed');
    }

    return true;
  }
}

const digioServiceInstance = new DigioService();
export default digioServiceInstance;
