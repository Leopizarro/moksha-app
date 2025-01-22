'use client'
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { JSX, ReactNode } from "react";

interface ProviderProps {
    children: ReactNode | null; // Accepts any valid React child (e.g., JSX, string, etc.)
    session?: Session | null | undefined; // Use the Session type from next-auth, or null if session isn't required
  }
  

export default function Provider({ children, session }: ProviderProps): JSX.Element {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}