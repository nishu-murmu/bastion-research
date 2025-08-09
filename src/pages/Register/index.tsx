import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/api/axios';
import { AuthResponse } from '@/types';

const registerSchema = z.object({
  username: z.string().min(2),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  address_1: z.string().min(2),
  address_2: z.string().optional(),
  pan_card_number: z.string().min(10),
  state: z.string().min(2),
  city: z.string().min(2),
  pin_code: z.string().min(6),
  date_of_birth: z.string(),
  gst_number: z.string().optional(),
  company: z.string().optional(),
  password: z.string().min(6),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation<AuthResponse, Error, RegisterFormValues>({
    mutationFn: (data) =>
      axiosInstance.post('/api/auth/signup', data).then((res) => res.data),
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/dashboard');
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input placeholder="Username" {...register('username')} />
          <Input placeholder="First Name" {...register('first_name')} />
          <Input placeholder="Last Name" {...register('last_name')} />
          <Input placeholder="Phone" {...register('phone')} />
          <Input placeholder="Email" {...register('email')} />
          <Input placeholder="Address 1" {...register('address_1')} />
          <Input placeholder="Address 2" {...register('address_2')} />
          <Input placeholder="PAN Card Number" {...register('pan_card_number')} />
          <Input placeholder="State" {...register('state')} />
          <Input placeholder="City" {...register('city')} />
          <Input placeholder="PIN Code" {...register('pin_code')} />
          <Input placeholder="Date of Birth" type="date" {...register('date_of_birth')} />
          <Input placeholder="GST Number" {...register('gst_number')} />
          <Input placeholder="Company" {...register('company')} />
          <Input placeholder="Password" type="password" {...register('password')} />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Registering...' : 'Register'}
          </Button>
          {mutation.isError && (
            <p className="mt-2 text-sm text-red-600">
              {mutation.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
