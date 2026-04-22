import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        const existingAdmin = await User.findOne({ email: "aasthajainokok@gmail.com" });
        if (existingAdmin) {
            return NextResponse.json({ message: "Admin already exists" }, { status: 200 });
        }

        // Remove old admin if exists
        await User.deleteOne({ email: "admin@tache.com" });

        const hashedPassword = await bcrypt.hash("zademeadous2004", 10);

        const adminUser = new User({
            name: "Aastha Jain",
            email: "aasthajainokok@gmail.com",
            password: hashedPassword,
            role: "admin",
        });

        await adminUser.save();

        return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
