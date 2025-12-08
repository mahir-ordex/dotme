import { getUserByIdQuery } from '../../graphql/query/user';
import { FeedCard } from '../components/feedCart';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { graphQLClient } from '../../client/api';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Await params in Next.js 15
  const { id } = await params;
  try {
    const result = await graphQLClient.request(getUserByIdQuery as any, { id });
    const user= result.getUserById;
    
    console.log('Fetched user:', user);

    if (!user) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">User not found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-[600px] mx-auto border-x border-gray-800">
          {/* Header with Back Button */}
          <div className="sticky top-0 backdrop-blur-md bg-black/80 border-b border-gray-800 px-4 py-3 flex items-center space-x-4">
            <Link href="/" className="p-2 hover:bg-gray-900 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{user.firstName} {user.lastName || ''}</h1>
              <p className="text-sm text-gray-500">{user.tweets?.length || 0} Tweets</p>
            </div>
          </div>

          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>

          {/* Profile Info */}
          <div className="px-4 pb-4">
            {/* Profile Picture */}
            <div className="flex justify-between items-end mb-4">
              <div className="-mt-16">
                <img
                  src={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-black"
                />
              </div>
              <button className="border border-gray-300 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-900 transition-colors mt-4">
                Follow
              </button>
            </div>

            {/* User Info */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName || ''}
              </h2>
              <p className="text-gray-500 text-base">
                @{user.firstName?.toLowerCase().replace(/\s+/g, '')}{user.lastName?.toLowerCase() || ''}
              </p>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-base">
                Software Developer | Building awesome things with code ✨
              </p>
            </div>

            {/* Join Date & Location */}
            <div className="flex items-center space-x-4 text-gray-500 text-sm mb-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>India</span>
              </div>
         
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined November 2024</span>
              </div>
            </div>

            {/* Following/Followers */}
            <div className="flex space-x-6 text-sm">
              <div className="flex space-x-1">
                <span className="font-bold text-white">{user.following.length}</span>
                <span className="text-gray-500">Following</span>
              </div>
              <div className="flex space-x-1">
                <span className="font-bold text-white">{user.follower.length}</span>
                <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-800">
            <div className="flex">
              <button className="flex-1 py-4 text-center font-bold text-white border-b-2 border-[#1d9bf0]">
                Posts
              </button>
              <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-900 transition-colors">
                Replies
              </button>
              <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-900 transition-colors">
                Media
              </button>
              <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-900 transition-colors">
                Likes
              </button>
            </div>
          </div>

          {/* User's Tweets */}
          <div>
            {user.tweets && user.tweets.length > 0 ? (
              <div>
                {user.tweets.map((tweet: any) => {
                  // Create a tweet object with author info for FeedCard
                  const tweetWithAuthor = {
                    ...tweet,
                    author: {
                      id: user.id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      profileImage: user.profileImage
                    }
                  };
                  return (
                    <FeedCard key={tweet.id} tweet={tweetWithAuthor}/>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-white mb-2">No Tweets yet</h3>
                  <p>When {user.firstName} posts, they'll show up here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error loading profile</p>
        </div>
      </div>
    );
  }
}