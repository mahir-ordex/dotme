'use client';

import { Navbar } from './components/Navbar';
import { RightSidebar } from './components/RightSidebar';
import { useRouter } from 'next/navigation';
import ClientSideContent from "./components/ClientSideContent";
import { useGetCurrentUser } from '../Hooks/user';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { data: currentUser, isLoading, error } = useGetCurrentUser();

  // Safely extract user data with null checks
  const rawUser = currentUser?.getCurrentUser || null;

  const user = rawUser ? {
    id: rawUser?.id,
    firstName: rawUser?.firstName || '',
    lastName: rawUser.lastName || '',
    profileImage: rawUser.profileImage || '',
    email: rawUser.email
  } : null;

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    
    if (!token || (error && !isLoading)) {
      console.log('No token or error, redirecting to login...');
      router.push('/login');
    }
  }, [error, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar user={user} />

      <div className="md:ml-16 lg:ml-64 xl:ml-80 pb-16 md:pb-0">
        <div className="flex max-w-7xl mx-auto">
          <main className="flex-1 min-w-0 w-full md:max-w-[600px] border-r border-gray-800">
            <div className="sticky top-0 backdrop-blur-md bg-black/80 border-b border-gray-800 px-4 py-3 z-40">
              <h1 className="text-xl font-bold">Home</h1>
            </div>

            <ClientSideContent user={user} />
          </main>

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