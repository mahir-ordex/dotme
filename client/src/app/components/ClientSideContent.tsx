'use client'
import { useEffect, useState } from "react";
import { FeedCard } from "./feedCart";
import TweetComposer from './TweetComposer';
import { useGetAllTweet } from "../../Hooks/tweet";

export default function ClientSideContent({ user }: { user: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const { tweets, isLoading, error } = useGetAllTweet();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state until component is mounted and while data is loading
  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d9bf0]"></div>
        <span className="ml-3 text-gray-400">Loading tweets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">Error loading tweets</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-[#1d9bf0] hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Tweet Composer */}
      <TweetComposer user={user} />

      {/* Feed */}
      <div>
        {!tweets || tweets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No tweets yet</p>
            <p className="text-sm mt-2">Be the first to post something!</p>
          </div>
        ) : (
          tweets.map((tweet: any) => (
            <FeedCard key={tweet.id} tweet={tweet} />
          ))
        )}
      </div>
    </>
  );
}