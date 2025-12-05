import {
  useQuery,
} from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { getCurrentUserQuery, getUserByIdQuery } from '../graphql/query/user';

export const getCurrentUser = () => {
    const query = useQuery({
        queryKey: ['current-user'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }
            
            console.log('Making request with token:', token);
            
            const client = new GraphQLClient('http://localhost:8000/graphql', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await client.request(getCurrentUserQuery as any);
            console.log("GraphQL response:", result);
            
            return result.getCurrentUser;
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
        retry: false,
    });
    
    return query;
}


export const useGetUserById = (id: string) => {
    return useQuery({
        queryKey:['id',id],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }
            
            const client = new GraphQLClient('http://localhost:8000/graphql', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await client.request(getUserByIdQuery as any, { id });
            return result;
        },
        enabled: !!id && typeof window !== 'undefined' && !!localStorage.getItem('token'),
        retry: false,
    });
}