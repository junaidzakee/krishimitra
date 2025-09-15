"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Languages,
  LifeBuoy,
  LogOut,
  Settings,
  User,
  Mic,
  Volume2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "./ui/skeleton";
import { useVoice } from "@/hooks/use-voice";
import { useLanguage, languages } from "@/hooks/use-language";

function getBreadcrumb(pathname: string) {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumb = segments.length > 0 ? segments[0] : 'dashboard';
    return breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1).replace('-', ' ');
}

export function Header() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { 
    voiceInputEnabled, 
    setVoiceInputEnabled, 
    voiceOutputEnabled, 
    setVoiceOutputEnabled 
  } = useVoice();
  const { language, setLanguage } = useLanguage();
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

  const renderAuthSection = () => {
    if (isAuthPage) return null;
    
    if (loading) {
        return <Skeleton className="h-8 w-32" />
    }

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                    <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                    <Link href="/sign-up">Sign Up</Link>
                </Button>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                <AvatarImage src="https://picsum.photos/seed/user/40/40" />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile" passHref>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings" passHref>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/support" passHref>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                <Languages className="mr-2 h-4 w-4" />
                <span>Language</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                    {languages.map(lang => (
                      <DropdownMenuRadioItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuCheckboxItem
              checked={voiceInputEnabled}
              onCheckedChange={setVoiceInputEnabled}
            >
              <Mic className="mr-2 h-4 w-4" />
              <span>Voice Input</span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={voiceOutputEnabled}
              onCheckedChange={setVoiceOutputEnabled}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              <span>Voice Output</span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getBreadcrumb(pathname)}</h1>
      </div>

      {renderAuthSection()}
    </header>
  );
}
