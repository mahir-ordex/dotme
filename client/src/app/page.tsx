import { FeedCard } from "./components/feedCart";
import { Navbar } from './components/Navbar';
import { RightSidebar } from './components/RightSidebar';
import TweetComposer from './components/TweetComposer';
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { getCurrentUserQuery } from "../graphql/query/user";
import { getAllTweetsQuery } from "../graphql/query/tweet";

export default async function Home() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('__twitter_token__')?.value;

  const client = new GraphQLClient('http://localhost:8000/graphql', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchCurrentUser = async () => {
    const data = await client.request(getCurrentUserQuery);
    return data.getCurrentUser;
  }

  const fetchAllTweets = async () => {
    const {data} = await client.rawRequest(getAllTweetsQuery as any, {token});
    return data.getAllTweets;
  }

  const [user, tweets = []] = await Promise.all([
    fetchCurrentUser(),
    fetchAllTweets()
  ]);


  // Redirect to login if no user
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Navbar user={user} />

      {/* Main Content */}
      <div className="flex-1 max-w-[600px] border-r border-gray-800 ml-64 xl:ml-80">
        {/* Header */}
        <div className="sticky top-0 backdrop-blur-md bg-black/80 border-b border-gray-800 px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        {/* Tweet Composer - Client Component */}
        <TweetComposer user={user} />

        {/* Feed - Server Components */}
        <div>
          {tweets?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No tweets yet</div>
          ) : (
            tweets?.map((tweet: any) => (
              <FeedCard key={tweet.id} tweet={tweet} />
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
