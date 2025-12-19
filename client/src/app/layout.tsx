import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from './components/QueryProvider';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Script from "next/script";

export const metadata: Metadata = {
    title: ".Me - Social App",
    description: "A modern social media platform",
};

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
console.log("Google Client ID:",clientId);

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <GoogleOAuthProvider clientId={clientId}>
                    <QueryProvider>
                        {children}
                    </QueryProvider>
                </GoogleOAuthProvider>
                <Script 
                    src="https://checkout.razorpay.com/v1/checkout.js"
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}