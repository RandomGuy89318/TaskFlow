import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow — Modern Task Manager",
    template: "%s | TaskFlow",
  },
  description:
    "TaskFlow is a full-stack task management app with Kanban boards, calendar view, analytics, project organisation, and team-ready Supabase auth.",
  keywords: [
    "task manager",
    "kanban board",
    "productivity",
    "project management",
    "Next.js",
    "Supabase",
  ],
  authors: [{ name: "TaskFlow Contributors" }],
  openGraph: {
    title: "TaskFlow — Modern Task Manager",
    description:
      "Manage tasks with Kanban boards, calendar view, analytics, and real-time collaboration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('task-manager-storage');
                  if (stored) {
                    const state = JSON.parse(stored);
                    if (state.state?.darkMode === true || (state.state?.darkMode === undefined && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ProtectedRoute>
            <ThemeProvider>{children}</ThemeProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
