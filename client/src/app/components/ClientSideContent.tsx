'use client'
import { useEffect, useRef, useState } from "react";
import { FeedCard } from "./feedCart";
import TweetComposer from './TweetComposer';
import { usePaginatedTweets } from "../../Hooks/tweet";

export default function ClientSideContent({ user }: { user: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const { 
    tweets, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = usePaginatedTweets(10);

  // Ref for the sentinel element at the bottom
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isMounted) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // When the sentinel element is visible and we have more pages
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isMounted, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Show loading state until component is mounted and while initial data is loading
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
          <>
            {tweets.map((tweet: any) => (
              <FeedCard key={tweet.id} tweet={tweet} user={user} />
            ))}
            
            {/* Sentinel element for intersection observer */}
            <div ref={loadMoreRef} className="h-10">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1d9bf0]"></div>
                  <span className="ml-2 text-gray-400 text-sm">Loading more...</span>
                </div>
              )}
              {!hasNextPage && tweets.length > 0 && (
                <div className="text-center text-gray-500 py-4 text-sm">
                  You've reached the end
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}