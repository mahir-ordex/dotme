'use client';
import { useCallback, useEffect, useState } from 'react';
import type { RequestDocument } from 'graphql-request';
import { graphQLClient } from '../../../client/api';
import { GoogleLogin } from '@react-oauth/google';
import { verifyGoogleTokenQuery } from '../../../graphql/query/user';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = useCallback(async (token: string) => {
        try {
            setIsLoading(true);
            console.log('Starting login...');
            
            const res = await graphQLClient.request(verifyGoogleTokenQuery as unknown as RequestDocument, { token });
            const verifyGoogleToken = res.verifyGoogleToken;
            console.log('Login response:', verifyGoogleToken);
            
            if (!verifyGoogleToken) {
                console.error('No token returned from verifyGoogleToken');
                setIsLoading(false);
                return;
            }
            
            // Save to localStorage
            window.localStorage.setItem('token', verifyGoogleToken);
            
            console.log('Token saved, redirecting...');
            
            // Redirect to home
            window.location.href = '/';
            
        } catch (error) {
            console.error('Error during login:', error);
            setIsLoading(false);
        }
    }, []);
    
    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen bg-black text-white'>
                <p>Logging in...</p>
            </div>
        );
    }
    
    return (
        <div className='flex justify-center items-center h-screen bg-black p-10 py-14'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold mb-8 text-white'>Welcome to .Me</h1>
                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        const credential = credentialResponse?.credential;
                        if (typeof credential === 'string') {
                            handleLogin(credential);
                        } else {
                            console.log('Google credential is undefined');
                        }
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </div>
        </div>
    );
}