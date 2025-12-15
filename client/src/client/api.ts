import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_API_URL,
    {
        credentials: 'include',
        headers: () => {
            const baseHeaders: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // For client-side requests, check both localStorage and cookies
            if (typeof window !== 'undefined') {
                const localToken = localStorage.getItem('token');
                const cookieToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token'))
                    ?.split('=')[1];

                const token = cookieToken || localToken;

                if (token) {
                    baseHeaders.Authorization = `Bearer ${token}`;
                }
            }

            return baseHeaders;
        },
    }
);