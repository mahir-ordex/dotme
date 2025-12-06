import { useQuery } from '@tanstack/react-query'
import { getUserByIdQuery } from '../graphql/query/user';
import { graphQLClient } from '../client/api';

export const useGetUserById = (id: string) => {
    const query = useQuery({
        queryKey:['id',id],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }
            

            
            const result = await graphQLClient.request(getUserByIdQuery as any, { id });
            return result;
        },
        enabled: !!id && typeof window !== 'undefined' && !!localStorage.getItem('token'),
        retry: false,

    })
    return {...query, user: query.data?.getUserById}
}