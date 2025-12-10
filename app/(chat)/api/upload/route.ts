import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { auth } from "@/app/(auth)/auth";
import { ChatSDKError } from "@/lib/errors";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// GET - Generate authentication parameters for client-side upload
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return new ChatSDKError(
      "bad_request:api",
      "Failed to generate upload credentials"
    ).toResponse();
  }
}
