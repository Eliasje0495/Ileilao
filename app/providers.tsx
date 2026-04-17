"use client";

import { SessionProvider } from "next-auth/react";
import { UserDrawerProvider } from "@/components/UserDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserDrawerProvider>
        {children}
      </UserDrawerProvider>
    </SessionProvider>
  );
}
