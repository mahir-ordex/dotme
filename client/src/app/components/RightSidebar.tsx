import { Search } from 'lucide-react';

export function RightSidebar() {
  const trendingTopics = [
    { category: "Trending in Technology", topic: "NextJS", tweets: "47.2K Tweets" },
    { category: "Trending", topic: "GraphQL", tweets: "25.1K Tweets" },
    { category: "Technology · Trending", topic: "TypeScript", tweets: "18.7K Tweets" },
    { category: "Sports · Trending", topic: "World Cup", tweets: "105K Tweets" },
  ];

  const suggestedUsers = [
    { name: "Vercel", username: "vercel", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=vercel" },
    { name: "Next.js", username: "nextjs", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=nextjs" },
    { name: "React", username: "reactjs", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=react" },
  ];

  return (
    <div className="w-80 p-4 hidden lg:block">
      {/* Search Bar - This would need to be a client component for functionality */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          className="w-full bg-gray-900 border border-gray-800 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] focus:border-transparent"
          placeholder="Search Twitter"
          type="text"
          readOnly
        />
      </div>

      {/* What's happening */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-bold mb-3">What's happening</h2>
        <div className="space-y-3">
          {trendingTopics.map((trend, index) => (
            <div key={index} className="hover:bg-gray-800 p-2 -mx-2 rounded cursor-pointer transition-colors">
              <div className="text-gray-500 text-[13px] leading-4">{trend.category}</div>
              <div className="font-bold text-[15px] leading-5">{trend.topic}</div>
              <div className="text-gray-500 text-[13px] leading-4">{trend.tweets}</div>
            </div>
          ))}
        </div>
        <button className="text-[#1d9bf0] text-[15px] mt-3 hover:underline">
          Show more
        </button>
      </div>

      {/* Who to follow */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-3">Who to follow</h2>
        <div className="space-y-3">
          {suggestedUsers.map((suggestedUser, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={suggestedUser.avatar}
                  alt={suggestedUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-bold text-[15px] leading-5">{suggestedUser.name}</div>
                  <div className="text-gray-500 text-[15px] leading-5">@{suggestedUser.username}</div>
                </div>
              </div>
              <button className="bg-white text-black font-bold py-1 px-4 rounded-full text-[14px] hover:bg-gray-200 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
        <button className="text-[#1d9bf0] text-[15px] mt-3 hover:underline">
          Show more
        </button>
      </div>

      {/* Footer Links */}
      <div className="mt-4 px-4">
        <div className="flex flex-wrap text-[13px] text-gray-500 leading-4">
          <a href="#" className="hover:underline mr-3 mb-1">Terms of Service</a>
          <a href="#" className="hover:underline mr-3 mb-1">Privacy Policy</a>
          <a href="#" className="hover:underline mr-3 mb-1">Cookie Policy</a>
          <a href="#" className="hover:underline mr-3 mb-1">Accessibility</a>
          <a href="#" className="hover:underline mr-3 mb-1">Ads info</a>
          <a href="#" className="hover:underline mr-3 mb-1">More</a>
        </div>
        <div className="text-[13px] text-gray-500 mt-2">© 2024 X Corp.</div>
      </div>
    </div>
  );
}