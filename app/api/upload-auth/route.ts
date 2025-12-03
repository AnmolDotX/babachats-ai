import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY as string | undefined;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY as string | undefined;

  if (!privateKey || !publicKey) {
    return NextResponse.json(
      { error: "ImageKit keys are not configured" },
      { status: 500 }
    );
  }

  const { token, expire, signature } = getUploadAuthParams({
    privateKey,
    publicKey,
  });

  return NextResponse.json({ token, expire, signature, publicKey });
}
