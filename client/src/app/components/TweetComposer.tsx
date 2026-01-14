"use client"
import { useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../client/api";
import { getPresignUrlQuery } from "../../graphql/query/tweet";
import { createTweet } from "../../Hooks/tweet";
import { useState } from "react";
import { uploadImageToCloudinary } from '../../Hooks/useCloudinaryUpload';
import image from "next/image";
import { X } from "lucide-react";



const TweetComposer = ({ user }: any) => {
    const [content, setContent] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { mutateAsync } = createTweet();
    const queryClient = useQueryClient();

    // Cloudinary upload handler for multiple images
    const handleUploadToCloudinary = async (files: File[]): Promise<string[]> => {
        try {
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET || 'supa@me';
            if (!uploadPreset) throw new Error('Cloudinary unsigned upload preset missing');
            const urls: string[] = [];
            for (const file of files) {
                // 1. Get upload URL from GraphQL for each file
                const data = await graphQLClient.request(getPresignUrlQuery, {
                    imageType: file.type,
                    imageName: file.name
                });
                const uploadUrl = data.getPresignUrl;
                // 2. Upload to Cloudinary
                const imageUrl = await uploadImageToCloudinary(file, uploadUrl, uploadPreset);
                if (!imageUrl) throw new Error('Cloudinary upload failed');
                urls.push(imageUrl);
            }
            return urls;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    // Tweet creation handler for multiple images
    const handleCreateTweet = async () => {
        setIsUploading(true);
        try {
            let imageUrls: string[] | null = null;
            if (selectedImage && selectedImage.length > 0) {
                imageUrls = await handleUploadToCloudinary(selectedImage);
            }
            await mutateAsync({
                content,
                imageUrl: imageUrls // send array of URLs
            });
            setContent('');
            setSelectedImage([]);
            queryClient.invalidateQueries({ queryKey: ['all-tweet'] });
        } catch (error) {
            console.error('Error creating tweet:', error);
        } finally {
            setIsUploading(false);
        }
    };

    // Image selection handler for multiple images (append, not replace)
    const handleSelectImg = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const files = target.files ? Array.from(target.files) : [];
            setSelectedImage(prev => [...prev, ...files]);
        };
        input.click();
    };

    return (
        <>
            {/* Hide scrollbar for image preview container */}
            <style>{`
                #image-preview-container::-webkit-scrollbar {
                    display: none;
                }
                #image-preview-container {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
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

                        {/* Show selected image preview with remove icon */}
                        {selectedImage && selectedImage.length > 0 && (
                            <div className="mb-4 p-3 bg-gray-900 rounded-lg">
                                {/* Image previews */}
                                <div id="image-preview-container" className="flex overflow-x-scroll gap-2">
                                    {selectedImage.map((img, index) => (
                                        <div key={index} className="relative inline-block">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt="Preview"
                                                className="mt-2 max-w-full h-32 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setSelectedImage(prev => prev.filter((_, i) => i !== index))}
                                                className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 hover:bg-opacity-80 transition-colors"
                                                style={{ lineHeight: 0 }}
                                                aria-label="Remove image"
                                            >
                                                {/* X icon SVG */}
                                                <X />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleSelectImg}
                                    className="p-2 hover:bg-gray-900 rounded-full transition-colors"
                                    disabled={isUploading}
                                >
                                    <svg className="w-5 h-5 text-[#1d9bf0]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3zm0 12V7h18v10H3z" />
                                        <circle cx="8.5" cy="10.5" r="1.5" />
                                        <path d="M21 15l-4.5-4.5L14 13l-3-3-4 4v3h14z" />
                                    </svg>
                                </button>
                            </div>

                            <button
                                onClick={handleCreateTweet}
                                disabled={(!content.trim() && selectedImage.length === 0) || isUploading}
                                className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-full font-bold text-white transition-colors"
                            >
                                {isUploading ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default TweetComposer;
