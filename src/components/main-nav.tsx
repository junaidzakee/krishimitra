"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  BarChart,
  TestTube2,
  CloudSun,
  Leaf,
  LayoutGrid,
  Settings,
  LifeBuoy,
  History,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/soil-analysis", label: "Soil Analysis", icon: TestTube2 },
  { href: "/disease-detection", label: "Disease Detection", icon: Leaf },
  { href: "/weather", label: "Weather", icon: CloudSun },
  { href: "/market-prices", label: "Market Prices", icon: BarChart },
  { href: "/history", label: "History", icon: History },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
                <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-primary font-headline">AgriAssist</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} passHref>
                <SidebarMenuButton
                  isActive={
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  }
                  tooltip={link.label}
                  className="justify-start"
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" passHref>
              <SidebarMenuButton className="justify-start" tooltip="Settings" isActive={pathname.startsWith('/settings')}>
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/support" passHref>
              <SidebarMenuButton className="justify-start" tooltip="Support" isActive={pathname.startsWith('/support')}>
                <LifeBuoy className="h-5 w-5" />
                <span>Support</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
