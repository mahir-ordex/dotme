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
}