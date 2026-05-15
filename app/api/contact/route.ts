import { NextRequest } from "next/server";
import { handleApiError, messageResponse, errorResponse, successResponse } from "@/utils/apiResponse";
import { validateContactInput } from "@/utils/validation";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { EmailService } from "@/services/email.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return errorResponse("Unauthorized", 401);
    }

    await dbConnect();
    const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
    return successResponse(messages);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const validation = validateContactInput(data);
    if (!validation.valid) {
      return errorResponse(validation.errors.join(", "), 400);
    }

    const { name, email, message } = data;

    // Connect to database and save the message
    await dbConnect();
    
    const newMessage = new Message({
      name,
      email,
      message
    });
    
    await newMessage.save();
    console.log(`[Contact] New message saved to database from: ${name} (${email})`);

    // Also attempt to send email, but don't fail the request if it fails
    try {
      if (EmailService.isConfigured()) {
        await EmailService.sendContactEmail(name, email, message);
        console.log(`[Contact] Email notification sent successfully for ${name}`);
      } else {
        console.log(`[Contact] Email not configured. Skipping email notification.`);
      }
    } catch (emailError) {
      console.error("[Contact] Failed to send email notification, but message was saved:", emailError);
      // We don't throw here because the message was already saved to MongoDB successfully
    }

    return messageResponse("Message received successfully! We will get back to you soon.");
  } catch (error) {
    console.error("Contact API error:", error);
    return handleApiError(error);
  }
}



