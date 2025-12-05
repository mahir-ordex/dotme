import { BackButton } from '../components/BackButton';
import { Navbar } from '../components/Navbar';
import { GraphQLClient } from 'graphql-request';
import { useGetUserById } from '../../Hooks/user';
import { notFound } from 'next/navigation';


async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if(!id){
        return notFound();
    }
    
    // Server-side data fetching
    let user = null;
    let error = null;
    try {
        const result = useGetUserById(id)
        user = result.data.getUserById;
    } catch (err) {
        console.error('Error fetching user:', err);
        error = 'Failed to load user profile';
    }

    // Error handling
    if (error || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">
                        {error ? "Error" : "User Not Found"}
                    </h1>
                    <p>{error || "The user you're looking for doesn't exist."}</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return 'Unknown date';
            const date = new Date(parseInt(dateString));
            if (isNaN(date.getTime())) return 'Unknown date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Unknown date';
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex">

            {/* Main Content Area */}
            <div className="flex-1 max-w-[600px] border-r border-gray-800">
                {/* Header */}
                <div className="sticky top-0 backdrop-blur-md bg-black/80 border-b border-gray-800">
                    <div className="flex items-center px-4 py-3 space-x-4">
                        <BackButton />
                        <div>
                            <h1 className="text-xl font-bold">
                                {user.firstName} {user.lastName || ''}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {user.tweets?.length || 0} posts
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="pb-4">
                    {/* Cover Photo */}
                    <div className="h-48 bg-gray-800"></div>

                    {/* Profile Info */}
                    <div className="px-4">
                        {/* Profile Picture */}
                        <div className="flex justify-between items-end mb-4">
                            <div className="relative -mt-16">
                                <img
                                    src={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-black bg-black"
                                />
                            </div>
                            <button className="border border-gray-500 text-white px-4 py-1.5 rounded-full font-bold hover:bg-gray-900 transition-colors">
                                Edit profile
                            </button>
                        </div>

                        {/* User Details */}
                        <div className="mb-4">
                            <h1 className="text-xl font-bold mb-1">
                                {user.firstName} {user.lastName || ''}
                            </h1>
                            <p className="text-gray-500 mb-3">
                                @{user.firstName?.toLowerCase().replace(/\s+/g, '')}{user.lastName?.toLowerCase() || ""}
                            </p>
                            <p className="text-gray-500 mb-3">
                                📍 Joined December 2024
                            </p>
                            
                            {/* Following/Followers */}
                            <div className="flex space-x-6 text-sm">
                                <div>
                                    <span className="font-bold">0</span>
                                    <span className="text-gray-500 ml-1">Following</span>
                                </div>
                                <div>
                                    <span className="font-bold">0</span>
                                    <span className="text-gray-500 ml-1">Followers</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-800">
                            <nav className="flex">
                                <button className="flex-1 py-4 text-center font-medium text-white border-b-2 border-[#1d9bf0] hover:bg-gray-900">
                                    Posts
                                </button>
                                <button className="flex-1 py-4 text-center font-medium text-gray-500 hover:bg-gray-900">
                                    Replies
                                </button>
                                <button className="flex-1 py-4 text-center font-medium text-gray-500 hover:bg-gray-900">
                                    Media
                                </button>
                                <button className="flex-1 py-4 text-center font-medium text-gray-500 hover:bg-gray-900">
                                    Likes
                                </button>
                            </nav>
                        </div>

                        {/* Posts Section */}
                        <div className="mt-4">
                            {user.tweets && user.tweets.length > 0 ? (
                                <div className="space-y-4">
                                    {user.tweets.map((tweet: any) => (
                                        <div key={tweet.id} className="border-b border-gray-800 pb-4">
                                            <div className="flex space-x-3">
                                                <img
                                                    src={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="font-bold">
                                                            {user.firstName} {user.lastName || ''}
                                                        </span>
                                                        <span className="text-gray-500 text-sm">
                                                            @{user.firstName?.toLowerCase().replace(/\s+/g, '')}{user.lastName?.toLowerCase() || ""}
                                                        </span>
                                                        <span className="text-gray-500 text-sm">
                                                            {formatDate(tweet.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-white mb-2">{tweet.content}</p>
                                                    {tweet.imageUrl && (
                                                        <img
                                                            src={tweet.imageUrl}
                                                            alt="Tweet image"
                                                            className="rounded-lg max-w-full h-auto"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
                                    <p className="text-gray-500">When you post something, it'll show up here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar Space */}
            <div className="w-80 p-4 hidden lg:block">
                {/* Trending or suggestions can go here */}
            </div>
        </div>
    );
}

export default ProfilePage;