'use client'
import { useRouter } from "next/navigation";
export default function Page() {
    const router = useRouter();
    setTimeout(() => {
        router.push('/');
    }, 3000);
    return <div className="m-auto flex justify-center items-center h-screen">
        <h1>Thank You for Upgrading to Premium!</h1>
    </div>;
};