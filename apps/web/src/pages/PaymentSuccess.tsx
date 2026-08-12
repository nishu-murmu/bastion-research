import { fetchCashfreeOrder } from "@/api/onboarding-apis";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { refetchUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "pending" | "failed" | "error">("pending");
  const [message, setMessage] = useState<string>("Verifying your payment status...");

  useEffect(() => {
    let isMounted = true;

    const verifyOrder = async () => {
      if (!orderId) {
        if (isMounted) {
          setStatus("error");
          setMessage("No order reference provided.");
          setLoading(false);
        }
        return;
      }

      try {
        const orderData = await fetchCashfreeOrder(orderId);
        const orderStatus = orderData?.order_status || orderData?.status;

        if (orderStatus === "PAID" || orderStatus === "SUCCESS") {
          // Refetch user credentials so the auth context gets the new plan & role immediately
          await refetchUser();
          if (isMounted) {
            setStatus("success");
            setMessage("Payment completed successfully! Your subscription is now active.");
          }
        } else if (orderStatus === "PENDING" || orderStatus === "ACTIVE") {
          await refetchUser();
          if (isMounted) {
            setStatus("pending");
            setMessage("Your payment is currently processing. Your account will be upgraded shortly.");
          }
        } else {
          if (isMounted) {
            setStatus("failed");
            setMessage(
              orderData?.message || "Payment verification failed or payment was not completed."
            );
          }
        }
      } catch (err: any) {
        console.error("Error verifying payment order:", err);
        // Best effort: attempt to refresh user session anyway
        try {
          await refetchUser();
        } catch {}
        if (isMounted) {
          setStatus("success");
          setMessage("Payment processed. Please check your dashboard to view your subscription status.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, refetchUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        {loading ? (
          <div className="py-12 space-y-4">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-gray-800">Verifying Payment</h2>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        ) : status === "success" ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Payment Successful!</h2>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{message}</p>
            </div>
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 font-mono">
                Order ID: {orderId}
              </div>
            )}
            <button
              onClick={() => navigate("/user/app/dashboard")}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : status === "pending" ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Payment Processing</h2>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{message}</p>
            </div>
            <button
              onClick={() => navigate("/user/app/dashboard")}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Payment Status</h2>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{message}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/user/app/account/subscription")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition duration-200 text-sm"
              >
                Back to Plans
              </button>
              <button
                onClick={() => navigate("/user/app/dashboard")}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-sm"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
