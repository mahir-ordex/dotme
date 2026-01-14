import { v2 as cloudinary } from 'cloudinary';

export async function uploadCloude(file: any) {

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, 
        api_key: process.env.CLOUDINARY_API_KEY!, 
        api_secret: process.env.CLOUDINARY_API_SECRET! // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
        file
    ).catch((error) => {
           console.log(error);
           return null;});
    
    console.log("uploadResult : ",uploadResult);
    return uploadResult
      
}