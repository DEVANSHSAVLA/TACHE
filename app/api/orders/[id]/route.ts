import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const resParams = await params;
        const data = await req.json();
        const order = await Order.findByIdAndUpdate(resParams.id, data, { new: true });

        if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
