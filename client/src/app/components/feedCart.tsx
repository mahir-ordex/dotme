import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";
import { AiOutlineAreaChart } from "react-icons/ai";
import { LuShare } from "react-icons/lu";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProp {
    tweet: Tweet
}

export const FeedCard = ({ tweet }: FeedCardProp) => {
    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) {
            return 'Unknown date';
        }

        try {
            const date = new Date(Number(dateString));
            
            if (isNaN(date.getTime())) {
                console.log("Invalid date after parsing");
                return 'Unknown date';
            }

            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            return formattedDate;
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'Unknown date';
        }
    }

    const author = tweet.author || {
        id: 'unknown',
        firstName: 'Unknown',
        lastName: 'User',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown'
    };

    return (
        <div className="grid grid-cols-12 border-b border-gray-700 p-4 hover:bg-gray-900/50 transition-colors">
            <div className="col-span-1">
                <Link href={`/${author.id}`}>
                    <img 
                        src={author.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                        alt="Profile" 
                        className="rounded-full w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity" 
                    />
                </Link>
            </div>
            <div className="col-span-11 pl-3">
                <div className="flex items-center gap-2 mb-1">
                    <Link href={`/${author.id}`} className="hover:underline">
                        <h5 className="font-bold cursor-pointer">
                            {author.firstName} {author.lastName && author.lastName}
                        </h5>
                    </Link>
                    <h6 className="font-light text-gray-500">
                        @{author.firstName?.toLowerCase().replace(/\s+/g, '') || 'unknown'}
                        {author.lastName?.toLowerCase().replace(/\s+/g, '') || ''}
                    </h6>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm">{formatDate(tweet.createdAt)}</span>
                </div>
                <p className="mb-3">{tweet.content || 'No content'}</p>
                {tweet.imageUrl && (
                    <img 
                        src={tweet.imageUrl} 
                        alt="Tweet content" 
                        className="mb-3 rounded-2xl max-w-full" 
                    />
                )}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-10 text-gray-400">
                        <button aria-label="comment" className="flex items-center gap-1 text-sm hover:text-blue-400 transition-colors">
                            <FaRegComment className="text-lg" />
                            <span className="text-sm">0</span>
                        </button>

                        <button aria-label="repost" className="flex items-center gap-1 text-sm hover:text-green-400 transition-colors">
                            <BiRepost className="text-lg" />
                            <span className="text-sm">0</span>
                        </button>

                        <button aria-label="like" className="flex items-center gap-1 text-sm hover:text-red-500 transition-colors">
                            <FaRegHeart className="text-lg" />
                            <span className="text-sm">0</span>
                        </button>

                        <button aria-label="analytics" className="flex items-center gap-1 text-sm hover:text-yellow-400 transition-colors">
                            <AiOutlineAreaChart className="text-lg" />
                            <span className="text-sm">0</span>
                        </button>
                    </div>

                    <button aria-label="share" className="text-gray-400 hover:text-blue-400 transition-colors">
                        <LuShare className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
}
