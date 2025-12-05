import { prisma } from "../../utils/prismaClient.js";
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { graphQLContext } from "../../interfaces.js";


interface CreateTweetPayload {
    content: string,
    imageUrl?: string
};

interface GraphQLContext {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
    };
}

const s3Client = new S3Client({
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    region: process.env.AWS_REGION || 'asia-south-1' //(mumbai)
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
            
            return tweet;
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
            
            return tweets;
        } catch (error) {
            console.error('Error fetching tweets:', error);
            throw new Error('Failed to fetch tweets');
        }
    },
    getPresignUrl: async (parent: any, { imageType, imageName }: { imageType: string; imageName: string },ctx :graphQLContext) => {
        if(!ctx.user){
            throw new Error("Please authenticate first");
        }
        const allowedImageTypes = ['image/jpg','image/jpeg', 'image/png', 'image/gif'];

        if (!allowedImageTypes.includes(imageType)) {
            throw new Error("Invalid image type");
        }

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `content-images/${imageName}-${Date.now()}/${ctx.user?.id}.${imageType.split('/')[1]}`,
            ContentType: imageType
        });
        const presignUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return presignUrl;    
    }
};

export const resolvers = { 
    Mutation: mutations, 
    Query: queries
};