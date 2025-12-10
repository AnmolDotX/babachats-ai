import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  deleteUserProfile,
  getUserProfile,
  upsertUserProfile,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

const profileSchema = z.object({
  displayName: z.string().max(100).optional().nullable(),
  skills: z.string().max(1000).optional().nullable(),
  hobbies: z.string().max(1000).optional().nullable(),
  motivations: z.string().max(1000).optional().nullable(),
  currentFeelings: z.string().max(1000).optional().nullable(),
  occupation: z.string().max(200).optional().nullable(),
  additionalContext: z.string().max(2000).optional().nullable(),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const profile = await getUserProfile({ userId: session.user.id });

  return Response.json(profile);
}

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const body = await request.json();
    const parsed = profileSchema.parse(body);

    const [profile] = await upsertUserProfile({
      userId: session.user.id,
      ...parsed,
    });

    return Response.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new ChatSDKError(
        "bad_request:api",
        "Invalid profile data"
      ).toResponse();
    }
    throw error;
  }
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  await deleteUserProfile({ userId: session.user.id });

  return Response.json({ success: true });
}
