import axios from "axios";

type ZohoTokenResponse = {
    access_token: string;
    expires_in: number;
    api_domain?: string;
    token_type?: string;
};

let cachedToken:
    | {
        accessToken: string;
        expiresAt: number;
    }
    | null = null;

const ZOHO_TOKEN_URL = "https://accounts.zoho.in/oauth/v2/token";

const getZohoEnv = () => {
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error(
            "Zoho env vars missing. Please set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN."
        );
    }

    return { clientId, clientSecret, refreshToken };
};

const fetchNewAccessToken = async (): Promise<string> => {
    const { clientId, clientSecret, refreshToken } = getZohoEnv();

    const body = new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
    });

    const { data } = await axios.post<ZohoTokenResponse>(ZOHO_TOKEN_URL, body.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (!data?.access_token) {
        throw new Error("Failed to obtain Zoho access token.");
    }

    const expiresInMs = (data.expires_in ?? 3600) * 1000;
    cachedToken = {
        accessToken: data.access_token,
        // Subtract 60s to refresh a bit early
        expiresAt: Date.now() + expiresInMs - 60_000,
    };

    return data.access_token;
};

export const getAccessToken = async (): Promise<string> => {
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
        return cachedToken.accessToken;
    }
    return fetchNewAccessToken();
};


