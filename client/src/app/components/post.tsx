import { X } from "lucide-react";
import { useState } from "react";
import { uploadImageToCloudinary } from "../../Hooks/useCloudinaryUpload";
import { getPresignUrlQuery } from "../../graphql/query/tweet";
import { graphQLClient } from "../../client/api";
import { useQueryClient } from "@tanstack/react-query";
import { createTweet } from "../../Hooks/tweet";

type PostProps = {
    userImage: string;
    homeComponent: boolean;
    onClose?: () => void;
};

const Post = ({ userImage, homeComponent, onClose }: PostProps) => {
    const [input, setInput] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const { mutateAsync } = createTweet();

    function handleSelectImg() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = () => {
            if (input.files) {
                const filesArray = Array.from(input.files);
                setImages(prevImages => [...prevImages, ...filesArray]);
            }
        };
        input.click();
    }

    const handleUploadToCloudinary = async (files: File[]): Promise<string[]> => {
        try {
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET || 'supa@me';
            if (!uploadPreset) throw new Error('Cloudinary unsigned upload preset missing');
            const urls: string[] = [];
            for (const file of files) {
                const data = await graphQLClient.request(getPresignUrlQuery, {
                    imageType: file.type,
                    imageName: file.name
                });
                const uploadUrl = data.getPresignUrl;
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

    const handleCreateTweet = async () => {
        setIsUploading(true);
        try {
            let imageUrls: string[] | null = null;
            if (images && images.length > 0) {
                imageUrls = await handleUploadToCloudinary(images);
            }
            await mutateAsync({
                content: input,
                imageUrl: imageUrls // send array of URLs
            });
            setInput('');
            setImages([]);
            queryClient.invalidateQueries({ queryKey: ['all-tweet'] });
            if (onClose) onClose();
        } catch (error) {
            console.error('Error creating tweet:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-[#16181c] rounded-2xl shadow-2xl p-6 w-full max-w-xl mx-4 relative z-50 border border-gray-800">
            {!homeComponent && (
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    onClick={onClose}
                    aria-label="Close"
                    type="button"
                >
                    <X size={24} />
                </button>
            )}
            <div className="flex items-start space-x-4 mb-4">
                <img
                    src={userImage}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <textarea
                    className="w-full bg-transparent text-white rounded-lg p-2 border-none focus:outline-none resize-none text-lg"
                    value={input}
                    rows={3}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What's happening?"
                />
            </div>
            {images.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative">
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`Selected ${index}`}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 text-white hover:bg-opacity-80"
                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                aria-label="Remove image"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleSelectImg}
                        className="p-2 hover:bg-gray-900 rounded-full transition-colors"
                        disabled={isUploading}
                        type="button"
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
                    disabled={(!input.trim() && images.length === 0) || isUploading}
                    className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-full font-bold text-white transition-colors"
                    type="button"
                >
                    {isUploading ? 'Posting...' : 'Post'}
                </button>
            </div>
        </div>
    );
};

const PostModalWrapper = ({ user }: { user: { profileImage?: string } }) => {
    const [showPostModel, setShowPostModel] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowPostModel(true)}
                className="bg-[#1d9bf0] px-4 py-2 rounded-full text-white"
            >
                New Post
            </button>
            {showPostModel && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
                    <Post
                        userImage={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                        homeComponent={false}
                        onClose={() => setShowPostModel(false)}
                    />
                </div>
            )}
        </>
    );
};

export { PostModalWrapper };
export default Post;