import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadDir, uniqueName);

        await writeFile(filePath, buffer);

        // Return the public URL
        const imageUrl = `/uploads/${uniqueName}`;

        return NextResponse.json({ secure_url: imageUrl }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
