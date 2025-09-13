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

function getBreadcrumb(pathname: string) {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumb = segments.length > 0 ? segments[0] : 'dashboard';
    return breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1).replace('-', ' ');
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getBreadcrumb(pathname)}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/user/40/40" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages className="mr-2 h-4 w-4" />
              <span>Language</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>हिंदी (Hindi)</DropdownMenuItem>
              <DropdownMenuItem>ಕನ್ನಡ (Kannada)</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Mic className="mr-2 h-4 w-4" />
                <span>Voice Input</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuItem>Enabled</DropdownMenuItem>
                <DropdownMenuItem>Disabled</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
           <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Volume2 className="mr-2 h-4 w-4" />
                <span>Voice Output</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuItem>Enabled</DropdownMenuItem>
                <DropdownMenuItem>Disabled</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
