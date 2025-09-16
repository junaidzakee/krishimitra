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
  AreaChart,
  ShoppingBasket,
  HeartPulse,
  FlaskConical
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function MainNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/", label: t('sidebar.dashboard'), icon: LayoutGrid },
    { href: "/analytics", label: t('sidebar.analytics'), icon: AreaChart },
    { href: "/disease-detection", label: t('sidebar.diseaseDetection'), icon: Leaf },
    { href: "/soil-analysis", label: t('sidebar.soilAnalysis'), icon: FlaskConical },
    { href: "/crop-recommendation", label: t('sidebar.cropRecommendation'), icon: TestTube2 },
    { href: "/marketplace", label: t('sidebar.marketplace'), icon: ShoppingBasket },
    { href: "/farm-health", label: t('sidebar.farmHealth'), icon: HeartPulse },
    { href: "/market-prices", label: t('sidebar.marketPrices'), icon: BarChart },
  ];

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
                <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-primary font-headline">KrishiMitra</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
            <p className="text-xs text-muted-foreground px-2 pb-2">{t('sidebar.dashboard')}</p>
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
           <p className="text-xs text-muted-foreground px-2 pb-2">{t('sidebar.support')}</p>
          <SidebarMenuItem>
            <Link href="/history" passHref>
              <SidebarMenuButton className="justify-start" tooltip={t('sidebar.history')} isActive={pathname.startsWith('/history')}>
                <History className="h-5 w-5" />
                <span>{t('sidebar.history')}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/settings" passHref>
              <SidebarMenuButton className="justify-start" tooltip={t('sidebar.settings')} isActive={pathname.startsWith('/settings')}>
                <Settings className="h-5 w-5" />
                <span>{t('sidebar.settings')}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/support" passHref>
              <SidebarMenuButton className="justify-start" tooltip={t('sidebar.help')} isActive={pathname.startsWith('/support')}>
                <LifeBuoy className="h-5 w-5" />
                <span>{t('sidebar.help')}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
