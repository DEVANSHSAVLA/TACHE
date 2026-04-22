import dbConnect from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import Order from "@/models/Order";
import User from "@/models/User";
import { Users, Image as ImageIcon, ShoppingBag } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboard() {
    await dbConnect();

    const [artworksCount, ordersCount, usersCount] = await Promise.all([
        Artwork.countDocuments(),
        Order.countDocuments(),
        User.countDocuments({ role: "customer" }),
    ]);

    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-widest uppercase text-black mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-sm shadow-sm border border-[var(--tache-beige)] flex items-center space-x-4">
                    <div className="p-3 bg-[var(--tache-cream)] rounded-full text-[var(--tache-soft-brown)]">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Total Artworks</p>
                        <p className="text-2xl font-bold text-black">{artworksCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border border-[var(--tache-beige)] flex items-center space-x-4">
                    <div className="p-3 bg-[var(--tache-cream)] rounded-full text-[var(--tache-soft-brown)]">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Total Orders</p>
                        <p className="text-2xl font-bold text-black">{ordersCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border border-[var(--tache-beige)] flex items-center space-x-4">
                    <div className="p-3 bg-[var(--tache-cream)] rounded-full text-[var(--tache-soft-brown)]">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Total Customers</p>
                        <p className="text-2xl font-bold text-black">{usersCount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-[var(--tache-beige)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--tache-beige)]">
                    <h2 className="text-lg font-bold tracking-widest uppercase text-black">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--tache-cream)] text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--tache-beige)]">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order: any) => (
                                    <tr key={order._id.toString()} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-black">{order.name}</p>
                                            <p className="text-xs text-gray-500">{order.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.artworkType}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 border text-xs font-semibold uppercase tracking-wider
                        ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                                                    order.status === 'in-progress' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                                        order.status === 'completed' ? 'bg-green-50 text-green-800 border-green-200' :
                                                            'bg-red-50 text-red-800 border-red-200'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
