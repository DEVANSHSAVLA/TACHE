import { NextRequest } from "next/server";
import { EmailService } from "@/services/email.service";
import { handleApiError, messageResponse, errorResponse } from "@/utils/apiResponse";
import { validateContactInput } from "@/utils/validation";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const validation = validateContactInput(data);
    if (!validation.valid) {
      return errorResponse(validation.errors.join(", "), 400);
    }

    const { name, email, message } = data;

    if (!EmailService.isConfigured()) {
      console.log("[Contact] Email not configured. Message received from:", name, email);
      console.log("[Contact] Message:", message);
      return messageResponse("Message received! We'll get back to you soon.");
    }

    await EmailService.sendContactEmail(name, email, message);

    return messageResponse("Email sent successfully!");
  } catch (error) {
    return handleApiError(error);
  }
}
