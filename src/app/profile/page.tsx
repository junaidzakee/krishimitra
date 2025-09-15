"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: t('profile.toast.title'),
      description: t('profile.toast.description'),
    });
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user) {
    return <div className="text-center">{t('profile.signInPrompt')}</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t('profile.title')}</h1>
        <p className="text-muted-foreground">{t('profile.description')}</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://picsum.photos/seed/user/100/100" />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.displayName || user.email}</CardTitle>
              <CardDescription>{t('profile.card.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('profile.form.name.label')}</Label>
              <Input id="fullName" defaultValue={user.displayName || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.form.email.label')}</Label>
              <Input id="email" type="email" value={user.email || ""} disabled />
            </div>
             <div className="space-y-2">
              <Label htmlFor="location">{t('profile.form.location.label')}</Label>
              <Input id="location" placeholder={t('profile.form.location.placeholder')} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">{t('profile.form.submit')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
