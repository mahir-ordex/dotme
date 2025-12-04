"use client"
import { graphQLClient } from "@/client/api";
import { getPresignUrlQuery } from "@/graphql/query/tweet";
import { createTweet } from "@/Hooks/tweet";
// import { getCurrentUser } from "@/Hooks/user"
import { useState } from "react";

const TweetComposer = ({user}:any) => {
    const [content,setContent] = useState<string>('');
    const [selectedImage,setSelectedImage] = useState<File | null>(null);
    const [isUploading,setIsUploading] = useState<boolean>(false);
    const { mutate } = createTweet();
  
    // Fixed S3 upload function
    const uploadToS3 = async (file: File, presignedUrl: string): Promise<string> => {
      try {
        const res = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type
          }
        })
        if (!res.ok) {
          const errorText = await res.text();
          console.error('S3 upload error:', errorText);
          throw new Error(`S3 upload failed: ${res.statusText}`);
        }
        console.log("presigned URL : ", presignedUrl)
        return presignedUrl.split('?')[0];
  
      } catch (error) {
        console.error('Error in uploadToS3:', error);
        throw error;
      }
    };
  
    // Fixed upload handler with proper GraphQL query
    const handleUploadToS3 = async (file: File): Promise<string> => {
      try {
  
        const data = await graphQLClient.request(getPresignUrlQuery, {
          imageType: file.type,
          imageName: file.name
        });
  
        console.log("S3 presigned URL response:", data);
  
        if (!data.getPresignUrl) {
          throw new Error('No presigned URL received');
        }
        const publicUrl = await uploadToS3(file, data.getPresignUrl);
        return publicUrl;
      } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
      }
    }
  
    // Fixed tweet creation handler
  
  
    // Fixed image selection handler
    const handleSelectImg = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
  
      input.onchange = (event: any) => {
        const file = event.target.files?.[0];
  
        if (file) {
          setSelectedImage(file);
          console.log("Selected file:", {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
            file: file
          });
        }
      };
  
      input.click();
    }
    return (
    <div className="border-b border-gray-800 px-4 py-4">
        <div className="flex space-x-4">
            <img
                src={user?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                alt="Your avatar"
                className="w-12 h-12 rounded-full mt-1"
            />
            <div className="flex-1">
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="What is happening?!"
                        className="w-full bg-transparent text-xl placeholder-gray-500 border-none outline-none resize-none"
                        rows={3}
                        disabled={isUploading}
                    />
                </div>

                {/* Show selected image preview */}
                {selectedImage && (
                    <div className="mb-4 p-3 bg-gray-900 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300">Selected Image:</span>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="text-red-400 hover:text-red-300 text-sm"
                                disabled={isUploading}
                            >
                                Remove
                            </button>
                        </div>
                        <div className="text-sm text-gray-400">
                            <div>Name: {selectedImage.name}</div>
                            <div>Size: {(selectedImage.size / 1024).toFixed(2)} KB</div>
                            <div>Type: {selectedImage.type}</div>
                        </div>
                        {/* Image preview */}
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="mt-2 max-w-full h-32 object-cover rounded"
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}

export default TweetComposer;
