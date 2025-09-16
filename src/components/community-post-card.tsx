
"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { doc, updateDoc, arrayUnion, arrayRemove, runTransaction, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '@/app/community/page';
import { useTimeAgo } from '@/hooks/use-time-ago';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CommunityPostCardProps {
  post: Post;
  isDetailedView?: boolean;
}

export function CommunityPostCard({ post, isDetailedView = false }: CommunityPostCardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const timeAgo = useTimeAgo(post.createdAt?.toDate());
  const { toast } = useToast();
  const [isLiking, setIsLiking] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleLike = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: t('community.toast.authError.title') });
        return;
    }
    setIsLiking(true);
    const postRef = doc(db, 'community_posts', post.id);
    const hasLiked = post.likes.includes(user.uid);
    try {
        await updateDoc(postRef, {
            likes: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
        });
    } catch (error) {
        console.error("Error liking post:", error);
        toast({ variant: 'destructive', title: t('community.toast.likeError.title') });
    } finally {
        setIsLiking(false);
    }
  };
  
  const handleDelete = async () => {
    if (!user || user.uid !== post.authorId) return;

    setIsDeleting(true);
    try {
        await runTransaction(db, async (transaction) => {
            const postRef = doc(db, 'community_posts', post.id);
            transaction.delete(postRef);
        });
        toast({ title: t('community.toast.deleteSuccess.title') });
    } catch (error) {
        console.error("Error deleting post:", error);
        toast({ variant: 'destructive', title: t('community.toast.deleteError.title') });
    } finally {
        setIsDeleting(false);
    }
  };

  const userHasLiked = user ? post.likes.includes(user.uid) : false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={post.authorPhotoURL || `https://avatar.vercel.sh/${post.authorId}.png`} />
                <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-lg">{post.authorName}</CardTitle>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
            </div>
            {user && user.uid === post.authorId && (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('community.deleteDialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('community.deleteDialog.description')}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>{t('community.deleteDialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            {t('community.deleteDialog.confirm')}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className={`text-muted-foreground ${!isDetailedView && 'line-clamp-3'}`}>
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant={userHasLiked ? "default" : "outline"} size="sm" onClick={handleLike} disabled={isLiking || !user}>
            {isLiking ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ThumbsUp className="mr-2 h-4 w-4" />}
            {post.likes.length} {t('community.postCard.likes')}
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="h-5 w-5" />
            <span>{post.commentCount || 0} {t('community.postCard.comments')}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
