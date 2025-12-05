"use client"
import { useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../client/api";
import { getPresignUrlQuery } from "../../graphql/query/tweet";
import { createTweet } from "../../Hooks/tweet";
import { useState } from "react";

const TweetComposer = ({user}:any) => {
    const [content,setContent] = useState<string>('');
    const [selectedImage,setSelectedImage] = useState<File | null>(null);
    const [isUploading,setIsUploading] = useState<boolean>(false);
    const { mutate } = createTweet();
    const queryClient = useQueryClient();
  
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
    const handleCreateTweet = async () => {
      setIsUploading(true);
      try {
        let imageUrl = null;
        if (selectedImage) {
          imageUrl = await handleUploadToS3(selectedImage);
        }
        mutate({
          content,
          imageUrl
        });
        setContent('');
        setSelectedImage(null);
        queryClient.invalidateQueries({ queryKey: ['all-tweet'] });
      } catch (error) {
        console.error("Error creating tweet:", error);
      } finally { 
        setIsUploading(false);
      }
    };
  
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

                    {/* Tweet Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleSelectImg}
                                className="p-2 hover:bg-gray-900 rounded-full transition-colors"
                                disabled={isUploading}
                            >
                                <svg className="w-5 h-5 text-[#1d9bf0]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3zm0 12V7h18v10H3z"/>
                                    <circle cx="8.5" cy="10.5" r="1.5"/>
                                    <path d="M21 15l-4.5-4.5L14 13l-3-3-4 4v3h14z"/>
                                </svg>
                            </button>
                        </div>
                        
                        <button
                            onClick={handleCreateTweet}
                            disabled={(!content.trim() && !selectedImage) || isUploading}
                            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-full font-bold text-white transition-colors"
                        >
                            {isUploading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TweetComposer;
