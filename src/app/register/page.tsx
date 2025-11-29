
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
import { useSearchParams, useRouter } from 'next/navigation';


function RegisterPageContent() {
    const { toast } = useToast();
    const { registerWithEmail, loading } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();
    const redirectUrl = searchParams.get('redirect');

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const message = await registerWithEmail(displayName, email, password);
            toast({
                title: "Success!",
                description: message,
            });
            // After successful registration, redirect to login page with the same redirect parameter
            router.push(`/login${redirectUrl ? `?redirect=${redirectUrl}` : ''}`);
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: error.message,
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
                <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                <CardDescription>Enter your details to register.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input 
                        id="displayName" 
                        name="displayName"
                        type="text" 
                        placeholder="John Doe" 
                        required 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="user@princesspalace.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" 
                        name="password"
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href={`/login${redirectUrl ? `?redirect=${redirectUrl}`: ''}`} className="underline">
                        Login
                    </Link>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}
export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterPageContent />
        </Suspense>
    )
}
