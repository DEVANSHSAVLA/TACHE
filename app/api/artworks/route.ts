import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const artworks = await Artwork.find({}).sort({ createdAt: -1 });
        return NextResponse.json(artworks);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const artwork = new Artwork(data);
        await artwork.save();

        return NextResponse.json(artwork, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
