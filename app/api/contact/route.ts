import { NextRequest } from "next/server";
import { handleApiError, messageResponse, errorResponse } from "@/utils/apiResponse";
import { validateContactInput } from "@/utils/validation";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

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

    return messageResponse("Message received successfully! We will get back to you soon.");
  } catch (error) {
    console.error("Contact API error:", error);
    return handleApiError(error);
  }
}

