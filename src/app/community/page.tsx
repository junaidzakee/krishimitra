
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Loader2, Send } from 'lucide-react';
import { CommunityPostCard } from '@/components/community-post-card';

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
});

type PostFormValues = z.infer<typeof postSchema>;

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  createdAt: Timestamp;
  likes: string[];
  commentCount: number;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', content: '' },
  });

  useEffect(() => {
    const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: Post[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(postsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      toast({
        variant: 'destructive',
        title: t('community.toast.fetchError.title'),
        description: t('community.toast.fetchError.description'),
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [t, toast]);

  const onSubmit = async (data: PostFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: t('community.toast.authError.title'),
        description: t('community.toast.authError.description'),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'community_posts'), {
        ...data,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorPhotoURL: user.photoURL,
        createdAt: serverTimestamp(),
        likes: [],
        commentCount: 0,
      });
      form.reset();
      toast({
        title: t('community.toast.postSuccess.title'),
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: 'destructive',
        title: t('community.toast.postError.title'),
        description: t('community.toast.postError.description'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
       <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border text-center p-8 mt-8">
            <h2 className="text-2xl font-bold">{t('history.signIn.title')}</h2>
            <p className="text-muted-foreground">{t('history.signIn.description')}</p>
        </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">{t('breadcrumbs.community')}</h1>
          <p className="text-muted-foreground">{t('community.description')}</p>
        </div>
        {isLoading ? (
          <div className="space-y-4">
            <Card><CardHeader><CardTitle className="animate-pulse bg-muted rounded-md h-24 w-full"></CardTitle></CardHeader></Card>
            <Card><CardHeader><CardTitle className="animate-pulse bg-muted rounded-md h-24 w-full"></CardTitle></CardHeader></Card>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
             {posts.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">{t('community.noPosts')}</p>
                </div>
             )}
          </div>
        )}
      </div>

      <div className="md:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>{t('community.createPost.title')}</CardTitle>
            <CardDescription>{t('community.createPost.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('community.createPost.form.title.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('community.createPost.form.title.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('community.createPost.form.content.label')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('community.createPost.form.content.placeholder')}
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {t('community.createPost.form.submit')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
