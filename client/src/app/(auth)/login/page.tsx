'use client';
import { use, useCallback } from 'react';
import type { RequestDocument } from 'graphql-request';
import { graphQLClient } from '../../../client/api';
import { GoogleLogin } from '@react-oauth/google';
import { verifyGoogleTokenQuery } from '../../../graphql/query/user';
import { useQueryClient } from '@tanstack/react-query';

export default function Login() {
    const queryClient = useQueryClient();
    const handleLogin = useCallback(async (token: string) => {try {
        
            
            const res = await graphQLClient.request(verifyGoogleTokenQuery as unknown as RequestDocument, { token });
            const verifyGoogleToken = res.verifyGoogleToken;
            console.log('Login response:', verifyGoogleToken);
            if (!verifyGoogleToken) {
                console.error('No token returned from verifyGoogleToken');
                return;
            }
            window.localStorage.setItem('token', verifyGoogleToken);
            window.location.href = '/'; 
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
        
    }, [queryClient]);
    
    return (
        <div className='flex justify-center items-center h-screen p-10 py-14'>
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
    );
}