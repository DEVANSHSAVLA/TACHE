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
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Origin": "https://tache-art.vercel.app",
            "Referer": "https://tache-art.vercel.app/contact"
        },
        body: JSON.stringify({
            name,
            email,
            message,
            _subject: `New Contact Form Message from ${name}`,
            _template: "table"
        }),
    });

    const responseText = await response.text();
    let result;
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        console.error("FormSubmit returned non-JSON:", responseText);
        return errorResponse("FormSubmit returned an unexpected response. Please check Vercel logs.", 500);
    }

    if (response.ok && result.success === "true") {
        return messageResponse("Email sent successfully!");
    } else {
        return errorResponse(result.message || "Failed to send email", 500);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return handleApiError(error);
  }
}

