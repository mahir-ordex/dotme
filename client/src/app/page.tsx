import { Navbar } from './components/Navbar';
import { RightSidebar } from './components/RightSidebar';
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { getCurrentUserQuery } from "../graphql/query/user";
import ClientSideContent from "./components/ClientSideContent";

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

  const user = await fetchCurrentUser();

  // Redirect to login if no user
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar - Bottom on mobile, Left sidebar on desktop */}
      <Navbar user={user} />

      {/* Main Layout with proper responsive margins */}
      <div className="md:ml-16 lg:ml-64 xl:ml-80 pb-16 md:pb-0">
        <div className="flex max-w-7xl mx-auto">
          {/* Main Content - Centered feed */}
          <main className="flex-1 min-w-0 w-full md:max-w-[600px] border-r border-gray-800">
            {/* Header - Sticky on scroll */}
            <div className="sticky top-0 backdrop-blur-md bg-black/80 border-b border-gray-800 px-4 py-3 z-40">
              <h1 className="text-xl font-bold">Home</h1>
            </div>

            {/* Client Side Content (Tweet Composer + Feed) */}
            <ClientSideContent user={user} />
          </main>

          {/* Right Sidebar - Scrolls with content, sticky positioning for natural scroll */}
          <aside className="hidden xl:block xl:w-80">
            <div className="sticky top-0 p-4">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}