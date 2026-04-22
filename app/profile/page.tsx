import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="bg-white min-h-screen py-24 sm:py-32 px-6 sm:px-10">
            <div className="container mx-auto max-w-5xl">
                <header className="mb-16 space-y-4">
                    <p className="text-[10px] tracking-[0.4em] text-brand-burgundy font-bold uppercase">Buyer Registry</p>
                    <h1 className="text-4xl lg:text-6xl font-bold tracking-[0.1em] text-[#2E292E] uppercase">
                        Welcome, {session.user?.name || "Collector"}
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* User Info */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-[#FBFBFB] p-8 rounded-2xl border border-gray-100">
                           <h3 className="text-xs font-bold tracking-widest text-black uppercase mb-6">Account Details</h3>
                           <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                    <p className="text-sm font-medium text-gray-800">{session.user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-medium text-brand-burgundy uppercase tracking-widest">Verified Collector</p>
                                </div>
                           </div>
                        </div>
                    </div>

                    {/* Orders Placeholder */}
                    <div className="md:col-span-2">
                        <div className="bg-[#FBFBFB] p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
                           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                               <Image src="/design/stroke-v.png" alt="" width={32} height={32} className="opacity-20" />
                           </div>
                           <h3 className="text-lg font-bold tracking-widest text-[#2E292E] uppercase mb-4">No Orders Yet</h3>
                           <p className="text-sm text-gray-400 tracking-wide mb-8 max-w-sm">
                               You haven't purchased any masterpieces yet. Explore the gallery to find your next centerpiece.
                           </p>
                           <Link 
                                href="/gallery"
                                className="px-10 py-4 bg-[#2E292E] text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-brand-burgundy transition-all duration-500 rounded-full"
                           >
                               Explore Gallery
                           </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
