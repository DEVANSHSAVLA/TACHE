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

    // Send to FormSubmit via server-side fetch to bypass CORS
    const response = await fetch("https://formsubmit.co/ajax/aasthajainokok@gmail.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            message,
            _subject: `New Contact Form Message from ${name}`,
            _template: "table"
        }),
    });

    const result = await response.json();

    if (response.ok && result.success === "true") {
        return messageResponse("Email sent successfully!");
    } else {
        return errorResponse(result.message || "Failed to send email", 500);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

