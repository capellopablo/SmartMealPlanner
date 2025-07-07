"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/modules/auth/services/auth-service';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type UserFormValue = z.infer<typeof formSchema>;

const testCredentials = [
  {
    type: 'New User (needs onboarding)',
    email: 'test@example.com',
    password: 'Testing1234',
  },
  {
    type: 'Complete User (goes to dashboard)',
    email: 'admin@smartmeal.com',
    password: 'Testing1234',
  },
  {
    type: 'Demo User',
    email: 'demo@test.com',
    password: 'Testing1234',
  },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const authService = new AuthService();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.loginUser(data);

      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token);
        if (response.user?.profileCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = (creds: (typeof testCredentials)[0]) => {
    form.setValue('email', creds.email);
    form.setValue('password', creds.password);
    setError(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-0">
        <div className="grid md:grid-cols-2 md:gap-8">
          {/* Form Section */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Test Credentials Section */}
          <div className="w-full max-w-md mx-auto mt-8 md:mt-0">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PencilLine className="w-5 h-5" />
                  Test Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testCredentials.map((creds) => (
                  <Card key={creds.email}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{creds.type}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Email:</span> {creds.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Password:</span> {creds.password}
                      </p>
                      <Separator />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => handleAutoFill(creds)}
                      >
                        Auto Fill
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
