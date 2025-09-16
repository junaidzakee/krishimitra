"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';


const formSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const newUser = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        krishiCoins: 100, // Start with 100 bonus coins
        createdAt: new Date(),
      });

      toast({
        title: t('signUp.toast.success.title'),
        description: t('signUp.toast.success.description'),
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('signUp.toast.failure.title'),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('signUp.title')}</CardTitle>
          <CardDescription>
            {t('signUp.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signUp.form.email.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('signUp.form.email.placeholder')} {...field} />
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
                    <FormLabel>{t('signUp.form.password.label')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signUp.form.confirmPassword.label')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('signUp.form.submit')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {t('signUp.signInPrompt.text')}{' '}
            <Link href="/sign-in" className="underline">
              {t('signUp.signInPrompt.link')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
