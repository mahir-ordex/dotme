// d:\social-app\.Me\client\src\Hooks\user.ts
import { mutations } from './../../../server/src/controller/user/mutation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query' // ✅ Import useQueryClient
import { getCurrentUserQuery, getUserByIdQuery } from '../graphql/query/user';
import { graphQLClient } from '../client/api';
import { followUserMutation, unFollowUserMutation } from '../graphql/mutation/user';
import { RequestDocument } from 'graphql-request';

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

export const useGetCurrentUser = () => {
    const query = useQuery({
        queryKey:['current-user'],
        queryFn: async() => {
            const data = await graphQLClient.request(getCurrentUserQuery);
            console.log("Fetched current user:", data.getCurrentUser);
            return data;
        },
        staleTime: 0, // Always fetch fresh data
    })
    return {...query, data: query.data}
}

export const useFollowUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async(id: string) => {
            return graphQLClient.request(followUserMutation as unknown as RequestDocument, {to: id})
        },
        onSuccess: async () => {
            console.log("Follow successful, invalidating cache...");
            // Invalidate and refetch
            await queryClient.invalidateQueries({ queryKey: ['current-user'] });
            console.log("Successfully followed user!");
        },
        onError: (error) => {
            console.error("Error in Follow User:", error);
        }
    })
    return mutation
}

export const useUnFollowUser = () => {
    const queryClient = useQueryClient(); // ✅ Get the REAL client from context

    const mutation = useMutation({
        mutationFn: async(id: string) => {
            return graphQLClient.request(unFollowUserMutation as unknown as RequestDocument, {to: id})
        },
        onSuccess: async () => {
            console.log("Unfollow successful, invalidating cache...");
            // Invalidate and refetch
            await queryClient.invalidateQueries({ queryKey: ['current-user'] });
            console.log("Successfully unfollowed user!");
        },
        onError: (error) => {
            console.error("Error in Unfollow User:", error);
        }
    })
    return mutation
}