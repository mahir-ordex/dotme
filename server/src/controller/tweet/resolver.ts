import { prisma } from "../../utils/prismaClient.js";
// import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { graphQLContext } from "../../interfaces.js";
// import { uploadCloude } from "../../utils/UploadCloudenarry.js";
import { client } from "../../utils/redisClient.js";



interface CreateTweetPayload {
    content: string,
    imageUrl?: string[]
};

interface GraphQLContext {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
    };
}

// const s3Client = new S3Client({
//     credentials:{
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
//     },
//     region: process.env.AWS_REGION || 'ap-south-1' //(mumbai)
// })


const mutations = {
    createTweet: async (parent: any, { payload }: { payload: CreateTweetPayload }, ctx: GraphQLContext) => {
        try {
            if (!ctx.user) throw new Error("Please Authenticate First");
            
            const tweet = await prisma.tweet.create({
                data: {
                    content: payload.content,
                    imageUrl: payload.imageUrl ?? [], 
                    authorId: ctx.user.id,
                },
                include: {
                    author: true
                }
            });
            await client.del('ALL_TWEETS_')
            
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
            const cachedTweets = await client.get('ALL_TWEETS_');
            if (cachedTweets) {
                console.log('Fetching tweets from Redis cache');
                return JSON.parse(cachedTweets);
            }
            const tweets = await prisma.tweet.findMany({
                include: {
                    author: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            await client.set('ALL_TWEETS_', JSON.stringify(tweets));
            return tweets;
        } catch (error) {
            console.error('Error fetching tweets:', error);
            throw new Error('Failed to fetch tweets');
        }
    },
    getPresignUrl: async (_parent: any, { imageType, imageName }: { imageType: string; imageName: string }, ctx: graphQLContext) => {
        if (!ctx.user) {
            throw new Error("Please authenticate first");
        }
        const allowedImageTypes = ['image/jpg','image/jpeg', 'image/png', 'image/gif'];
        if (!allowedImageTypes.includes(imageType)) {
            throw new Error("Invalid image type");
        }
        // Cloudinary unsigned upload preset (must be set in Cloudinary dashboard)
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.CLOUDINARY_UNSIGNED_PRESET;
        if (!cloudName || !uploadPreset) {
            throw new Error("Cloudinary config missing");
        }
        // Generate direct upload URL for client
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        return url;
    }
    // getPresignUrl: async (parent: any, { imageType, imageName }: { imageType: string; imageName: string },ctx :graphQLContext) => {
    //     if(!ctx.user){
    //         throw new Error("Please authenticate first");
    //     }
    //     const allowedImageTypes = ['image/jpg','image/jpeg', 'image/png', 'image/gif'];

    //     if (!allowedImageTypes.includes(imageType)) {
    //         throw new Error("Invalid image type");
    //     }
        // return uploadCloude()

        // const command = new PutObjectCommand({
        //     Bucket: process.env.S3_BUCKET_NAME!,
        //     Key: `content-images/${imageName}-${Date.now()}/${ctx.user?.id}.${imageType.split('/')[1]}`,
        //     ContentType: imageType
        // });
        // const presignUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        // return presignUrl;    
    // }
};

export const resolvers = { 
    Mutation: mutations, 
    Query: queries
};