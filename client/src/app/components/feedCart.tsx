import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";
import { AiOutlineAreaChart } from "react-icons/ai";
import { LuShare } from "react-icons/lu";
import { Tweet, User } from "../../gql/graphql";
import Link from "next/link";
import { FollowBtn } from "./FollowBtn";
import { isFollowedByUser } from "../../Hooks/isFollowByUser";

interface FeedCardProp {
    tweet: Tweet,
    user?: User
}

export const FeedCard = ({ tweet, user }: FeedCardProp) => {
    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) {
            return 'Unknown date';
        }

        try {
            const date = new Date(Number(dateString));

            if (isNaN(date.getTime())) {
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
        lastName: '',
        profileImage: null,
        email: ''
    };

    return (
        <div className="border-b border-gray-700 p-4 hover:bg-gray-900/50 transition-colors">
            <div className="flex gap-3">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                    <Link href={`/${author.id}`}>
                        <img
                            src={author.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                            alt="Profile"
                            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    </Link>
                </div>

                {/* Tweet Content */}
                <div className="flex-1 min-w-0">
                    {/* Header with Name, Username, Date, and Follow Button */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 min-w-0 flex-1">
                            <Link href={`/${author.id}`} className="hover:underline flex-shrink-0">
                                <h5 className="font-bold text-sm sm:text-base">
                                    {author.firstName} {author.lastName}
                                </h5>
                            </Link>
                            <h6 className="font-light text-gray-500 text-xs sm:text-sm truncate">
                                @{author.firstName?.toLowerCase().replace(/\s+/g, '') || 'unknown'}
                                {author.lastName?.toLowerCase().replace(/\s+/g, '') || ''}
                            </h6>
                            <span className="text-gray-500 hidden sm:inline">·</span>
                            <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">
                                {formatDate(tweet.createdAt)}
                            </span>
                        </div>

                        {/* Follow Button - Only show if not current user */}
                        {user && user.id !== author.id && (
                            <div className="flex-shrink-0">
                                <FollowBtn id={author.id} />
                            </div>
                        )}
                    </div>

                    <p className="mb-3 text-sm sm:text-base break-words whitespace-pre-wrap">
                        {tweet.content || 'No content'}
                    </p>

                    {tweet.imageUrl.length > 0 ? tweet.imageUrl.map((img, index) => (
                        <div key={img || index} className="mb-3 rounded-2xl overflow-hidden">
                            <img
                                src={img}
                                alt="Tweet content"
                                className="w-full h-auto object-cover max-h-96 sm:max-h-[500px]"
                            />
                        </div>
                    )) : null}

                    {/* Interaction Buttons */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-6 sm:gap-10 text-gray-400">
                            <button
                                aria-label="comment"
                                className="flex items-center gap-1 text-xs sm:text-sm hover:text-blue-400 transition-colors group"
                            >
                                <FaRegComment className="text-base sm:text-lg group-hover:scale-110 transition-transform" />
                                <span>0</span>
                            </button>

                            <button
                                aria-label="repost"
                                className="flex items-center gap-1 text-xs sm:text-sm hover:text-green-400 transition-colors group"
                            >
                                <BiRepost className="text-lg sm:text-xl group-hover:scale-110 transition-transform" />
                                <span>0</span>
                            </button>

                            <button
                                aria-label="like"
                                className="flex items-center gap-1 text-xs sm:text-sm hover:text-red-500 transition-colors group"
                            >
                                <FaRegHeart className="text-base sm:text-lg group-hover:scale-110 transition-transform" />
                                <span>0</span>
                            </button>

                            <button
                                aria-label="analytics"
                                className="hidden sm:flex items-center gap-1 text-xs sm:text-sm hover:text-yellow-400 transition-colors group"
                            >
                                <AiOutlineAreaChart className="text-base sm:text-lg group-hover:scale-110 transition-transform" />
                                <span>0</span>
                            </button>
                        </div>

                        <button
                            aria-label="share"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                            <LuShare className="text-base sm:text-lg hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}