import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    // Update the file type based on the kind of files you want to accept
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "File type should be JPEG or PNG",
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get("file") as File).name;

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !urlEndpoint) {
      return NextResponse.json(
        { error: "ImageKit is not configured" },
        { status: 500 }
      );
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file, filename);
    uploadForm.append("fileName", filename);
    uploadForm.append("useUniqueFileName", "true");

    const authHeader = Buffer.from(`${privateKey}:`).toString("base64");

    try {
      const res = await fetch("https://upload.imagekit.io/api/v1/files", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
        },
        body: uploadForm,
      });

      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json(
          { error: `Upload failed: ${err}` },
          { status: 500 }
        );
      }

      const data = await res.json();
      const contentType = (formData.get("file") as File).type;

      return NextResponse.json({
        url: data.url,
        pathname: filename,
        contentType,
      });
    } catch (_error) {
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
