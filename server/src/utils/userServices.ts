import { prisma } from "./prismaClient.js";

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
    }
}