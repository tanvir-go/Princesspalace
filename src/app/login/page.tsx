
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FormEvent, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function LoginPageContent() {
  const { toast } = useToast();
  const { signInWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      // The redirect is handled by the useAuth hook.
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-6">
        <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
                <Image src="/Plogo.png" alt="Princess Palace Logo" width={200} height={60} />
            </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="user@princesspalace.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
             <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href={`/register${redirectUrl ? `?redirect=${redirectUrl}`: ''}`} className="underline">
                        Register
                    </Link>
                </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageContent />
        </Suspense>
    )
}
