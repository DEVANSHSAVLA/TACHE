import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const resParams = await params;
        const artwork = await Artwork.findByIdAndUpdate(resParams.id, data, { new: true });

        if (!artwork) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(artwork);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const resParams = await params;
        const artwork = await Artwork.findByIdAndDelete(resParams.id);

        if (!artwork) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
