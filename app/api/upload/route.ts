import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UploadService } from "@/services/upload.service";
import { successResponse, errorResponse, handleApiError } from "@/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No file uploaded", 400);
    }

    const imageUrl = await UploadService.uploadImage(file);

    return successResponse({ secure_url: imageUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
