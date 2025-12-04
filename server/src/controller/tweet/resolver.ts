import { prisma } from "../../utils/prismaClient.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

interface CreateTweetPayload {
    content: string;
    imageUrl?: string;
}

interface GraphQLContext {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
    };
}

const accessToken = process.env.S3_ACCESS_KEY
const secret = process.env.S3_SECRET_KEY

const s3Client = new S3Client({
    credentials: {
        accessKeyId: accessToken!,
        secretAccessKey: secret!
    },
    region: "ap-south-1"
})

const mutations = {
    createTweet: async (parent: any, { payload }: { payload: CreateTweetPayload }, ctx: GraphQLContext) => {
        try {
            if (!ctx.user) throw new Error("Please Authenticate First");

            const tweet = await prisma.tweet.create({
                data: {
                    content: payload.content,
                    imageUrl: payload.imageUrl ?? null,
                    authorId: ctx.user.id,
                },
                include: {
                    author: true
                }
            });

            // Return createdAt as timestamp string
            return {
                ...tweet,
                createdAt: tweet.createdAt.getTime().toString()
            };
        } catch (error) {
            console.error('Error creating tweet:', error);
            throw new Error('Failed to create tweet');
        }
    }
};

const queries = {
    getAllTweets: async () => {
        try {
            const tweets = await prisma.tweet.findMany({
                include: {
                    author: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            // IMPORTANT: Format createdAt for each tweet
            return tweets.map(tweet => ({
                ...tweet,
                createdAt: tweet.createdAt.getTime().toString()
            }));
        } catch (error) {
            console.error('Error fetching tweets:', error);
            throw new Error('Failed to fetch tweets');
        }
    },
    
    getPresignUrl: async (parent: any, { imageType, imageName }: { imageType: string, imageName: string }, ctx: GraphQLContext) => {
        try {
            if (!ctx.user || !ctx.user.id) throw new Error("UnAuthenticated User!")
            
            const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
            if(!allowedImageTypes.includes(imageType)) throw new Error("Please Enter Valid Image");

            const extension = imageType.split('/')[1] ?? 'jpg';
            const putObjCommand = new PutObjectCommand({
                Bucket: "mahir-dotme-dev",
                Key: `upload/contentImages/${Date.now().toString()}/${imageName}/${ctx.user.id}.${extension}`,
                ContentType: imageType
            })
            
            const presignedUrl = await getSignedUrl(s3Client as any, putObjCommand as unknown as any, {
                expiresIn: 3600
            });
            
            return presignedUrl;

        } catch (error) {
            console.error('Error generating presign URL:', error);
            throw new Error('Failed to generate presign URL');
        }
    }
};

export const resolvers = {
    Mutation: mutations,
    Query: queries
};