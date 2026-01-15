'use client';
import { useFollowUser, useUnFollowUser, useGetCurrentUser } from "../../Hooks/user";
import { isFollowedByUser } from "../../Hooks/isFollowByUser";
import { User } from "../../gql/graphql";

interface FollowBtnProps {
    id: string;
    onFollowChange?: () => void;
}

export const FollowBtn = ({ id, onFollowChange }: FollowBtnProps) => {
    const { mutateAsync: followUser, isPending: isFollowing } = useFollowUser();
    const { mutateAsync: unfollowUser, isPending: isUnfollowing } = useUnFollowUser();
    const { data: currentUserData } = useGetCurrentUser();

    const isFollowed = currentUserData?.getCurrentUser ? isFollowedByUser(currentUserData.getCurrentUser as User, id) : false;

    const desableBtn = currentUserData?.getCurrentUser?.id === id;

    const handleToggleFollow = async () => {
        if (isFollowed) {
            await unfollowUser(id);
        } else {
            await followUser(id);
        }
        if (onFollowChange) onFollowChange();
    };

    const isLoading = isFollowing || isUnfollowing;

    return (
        <button
            onClick={handleToggleFollow}
            disabled={isLoading}
            className={`${desableBtn && 'hidden'} px-4 py-2 rounded-full font-semibold transition-colors ${
                isFollowed
                    ? 'bg-transparent border border-gray-600 text-white hover:bg-red-600 hover:border-red-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'

            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? 'Loading...' : isFollowed ? 'Following' : 'Follow'}
        </button>
    );
};