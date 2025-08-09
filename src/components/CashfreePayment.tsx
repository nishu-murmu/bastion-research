import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/api/axios';
import { useAuth } from '@/contexts/AuthContext';

interface OrderResponse {
  payment_link: string;
}

const CashfreePayment = () => {
  const { user } = useAuth();

  const mutation = useMutation<OrderResponse, Error, void>({
    mutationFn: () =>
      axiosInstance
        .post('/api/cashfree/orders', {
          plan: '3m', // This should be dynamic in a real application
          customer_id: user?.id,
          customer_email: user?.email,
          customer_phone: '9876543210', // This should be dynamic
        })
        .then((res) => res.data),
    onSuccess: (data) => {
      window.location.href = data.payment_link;
    },
  });

  const handlePayment = () => {
    mutation.mutate();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Payment</h2>
      <Button onClick={handlePayment} disabled={mutation.isPending}>
        {mutation.isPending ? 'Processing...' : 'Pay with Cashfree'}
      </Button>
      {mutation.isError && (
        <p className="mt-2 text-sm text-red-600">{mutation.error.message}</p>
      )}
    </div>
  );
};

export default CashfreePayment;
