import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { VoiceProvider } from '@/hooks/use-voice';
import { LanguageProvider } from '@/hooks/use-language';
import { VoiceAssistant } from '@/components/voice-assistant';

export const metadata: Metadata = {
  title: 'AgriAssist',
  description: 'Smart Crop Advisory Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
        )}
      >
        <AuthProvider>
          <LanguageProvider>
            <VoiceProvider>
              <SidebarProvider>
                <div className="flex min-h-screen">
                  <Sidebar>
                    <MainNav />
                  </Sidebar>
                  <SidebarInset className="flex flex-col flex-1">
                    <Header />
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                      {children}
                    </main>
                    <VoiceAssistant />
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </VoiceProvider>
          </LanguageProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
