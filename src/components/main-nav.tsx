
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
  FlaskConical,
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
    { href: "/weather", label: t('sidebar.weather'), icon: CloudSun },
    { href: "/marketplace", label: t('sidebar.marketplace'), icon: ShoppingBasket },
    { href: "/farm-health", label: t('sidebar.farmHealth'), icon: HeartPulse },
    { href: "/market-prices", label: t('sidebar.marketPrices'), icon: BarChart },
  ];

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.28 15.25C16.1 15.42 15.86 15.5 15.61 15.5C15.36 15.5 15.12 15.42 14.93 15.25L12 12.55L9.07 15.25C8.7 15.6 8.1 15.6 7.72 15.25C7.35 14.9 7.35 14.3 7.72 13.95L11.3 10.65C11.48 10.48 11.74 10.39 12 10.39C12.26 10.39 12.52 10.48 12.7 10.65L16.28 13.95C16.65 14.3 16.65 14.9 16.28 15.25Z"
                  fill="currentColor"
                />
              </svg>
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
