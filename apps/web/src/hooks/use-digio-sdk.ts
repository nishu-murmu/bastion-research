import { useRef, useCallback } from "react";

// Digio SDK is loaded globally via <script> in index.html

interface DigioOptions {
  environment: "production" | "sandbox";
  callback: (response: any) => void;
  logo?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  is_redirection_approach?: boolean;
  redirect_url?: string;
  is_iframe?: boolean;
  event_listener?: (event: any) => void;
  event_filter?: {
    events: string[];
  };
}

const DEFAULT_OPTIONS: DigioOptions = {
  environment: "sandbox",
  callback: (response: any) => {
    if (
      response &&
      Object.prototype.hasOwnProperty.call(response, "error_code")
    ) {
      // Handle error
      console.log("error occurred in process", response);
      return;
    }
    console.log("Signing completed successfully:", response);
  },
  logo: "https://www.mylogourl.com/image.jpeg",
  theme: {
    primaryColor: "#AB3498",
    secondaryColor: "#000000",
  },
};

declare global {
  // eslint-disable-next-line no-var
  var Digio: any;
}

const useDigioSdk = (options?: Partial<DigioOptions>) => {
  const digioRef = useRef<any>(null);

  // Instantiates Digio instance if not already created
  const getDigio = useCallback(() => {
    if (typeof window === "undefined" || typeof window.Digio !== "function") {
      throw new Error("Digio SDK not loaded");
    }
    if (!digioRef.current) {
      digioRef.current = new window.Digio({ ...DEFAULT_OPTIONS, ...options });
    }
    return digioRef.current;
  }, [options]);

  // Initializes the Digio popup window (must be called on user event)
  const init = useCallback(() => {
    const digio = getDigio();
    if (digio && typeof digio.init === "function") {
      digio.init();
    } else {
      throw new Error("Digio SDK not initialized properly");
    }
  }, [getDigio]);

  /**
   * Submits the signing request.
   * @param documentIdOrArray - string or string[] (document id(s) or request id)
   * @param identifier - email or mobile
   * @param token - (optional) token_id for token approach
   */
  const submit = useCallback(
    (
      documentIdOrArray: string | string[],
      identifier: string,
      token?: string
    ) => {
      const digio = getDigio();
      if (digio && typeof digio.submit === "function") {
        if (token) {
          // Token approach: digio.submit(requestId, identifier, token_id)
          digio.submit(documentIdOrArray, identifier, token);
        } else {
          // Standard: digio.submit(documentId(s), identifier)
          digio.submit(documentIdOrArray, identifier);
        }
      } else {
        throw new Error("Digio SDK not initialized properly");
      }
    },
    [getDigio]
  );

  // Cancels the transaction by closing the popup/iframe window
  const cancel = useCallback(() => {
    const digio = getDigio();
    if (digio && typeof digio.cancel === "function") {
      digio.cancel();
    } else {
      throw new Error("Digio SDK not initialized properly");
    }
  }, [getDigio]);

  return {
    getDigio,
    init,
    submit,
    cancel,
  };
};

export default useDigioSdk;
