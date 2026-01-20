import { prisma } from "./prismaClient.js";
import {client as redisClient} from '../utils/redisClient.js'

export class UserServices {
    public static async followUser(followerId: string, followingId: string): Promise<void> {
        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        // If already following, do nothing (or throw a friendly error)
        if (existingFollow) {
            console.log('Already following this user');
            return;
        }

        // Create the follow relationship
        await prisma.follow.create({
            data: {
                follower: {
                    connect: { id: followerId }
                },
                following: {
                    connect: { id: followingId }
                }
            }
        });
        await redisClient.del(`_ID_${followingId}`);
        console.log(`Cleared cache for user ID: ${followingId}`);
        return;
    }

    public static async unfollowUser(followerId: string, followingId: string): Promise<void> {
        // Check if the follow relationship exists before trying to delete
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        if (!existingFollow) {
            console.log('Not following this user');
            return;
        }

        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });
        await redisClient.del(`_ID_${followingId}`);
        console.log(`Cleared cache for user ID: ${followingId}`);
        return;
    }
    public static async updateUser(userId: string, input: { firstName?: string; lastName?: string; profileImage?: string; coverImage?: string, bio?: string, location?: string }): Promise<any> {
        // Only include fields that are actually provided in the input (including falsy values like empty string)
        const data: Record<string, any> = {};
        if (input.firstName !== undefined) data.firstName = input.firstName;
        if (input.lastName !== undefined) data.lastName = input.lastName;
        if (input.profileImage !== undefined) data.profileImage = input.profileImage;
        if (input.coverImage !== undefined) data.coverImage = input.coverImage;
        if( input.bio !== undefined) data.bio = input.bio;
        if( input.location !== undefined) data.location = input.location;

        if (Object.keys(data).length === 0) {
            // No fields to update
            return null;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data
        });
        await redisClient.del(`_ID_${userId}`);
        console.log(`Cleared cache for user ID: ${userId}`);
        return updatedUser;
    }
}