import type { NextRequest } from "next/server";
import { z } from "zod";
import { compareSync } from "bcrypt-ts";
import { auth } from "@/app/(auth)/auth";
import {
  getUserById,
  updateUserImage,
  updateUserName,
  updateUserPassword,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

const updateNameSchema = z.object({
  name: z.string().min(1).max(100),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(64),
});

const updateImageSchema = z.object({
  image: z.string().url(),
});

// GET - Fetch user account info
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const user = await getUserById({ id: session.user.id });

  if (!user) {
    return new ChatSDKError("not_found:database", "User not found").toResponse();
  }

  return Response.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    hasPassword: !!user.password, // Let client know if password is set (for OAuth users)
  });
}

// POST - Update user profile image
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const body = await request.json();
    const parsed = updateImageSchema.parse(body);

    const [updatedUser] = await updateUserImage({
      userId: session.user.id,
      image: parsed.image,
    });

    return Response.json({
      id: updatedUser.id,
      image: updatedUser.image,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new ChatSDKError(
        "bad_request:api",
        "Invalid image URL"
      ).toResponse();
    }
    throw error;
  }
}

// PUT - Update user name
export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const body = await request.json();
    const parsed = updateNameSchema.parse(body);

    const [updatedUser] = await updateUserName({
      userId: session.user.id,
      name: parsed.name,
    });

    return Response.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new ChatSDKError(
        "bad_request:api",
        "Invalid name format"
      ).toResponse();
    }
    throw error;
  }
}

// PATCH - Update user password (requires current password verification)
export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const body = await request.json();
    const parsed = updatePasswordSchema.parse(body);

    // Get current user to verify password
    const user = await getUserById({ id: session.user.id });

    if (!user) {
      return new ChatSDKError("not_found:database", "User not found").toResponse();
    }

    // If user has no password (OAuth only), they can't change it this way
    if (!user.password) {
      return new ChatSDKError(
        "bad_request:api",
        "Password change not available for OAuth accounts"
      ).toResponse();
    }

    // Verify current password
    const isPasswordValid = compareSync(parsed.currentPassword, user.password);

    if (!isPasswordValid) {
      return new ChatSDKError(
        "bad_request:api",
        "Current password is incorrect"
      ).toResponse();
    }

    // Update password
    await updateUserPassword({
      userId: session.user.id,
      newPassword: parsed.newPassword,
    });

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new ChatSDKError(
        "bad_request:api",
        "Password must be at least 8 characters"
      ).toResponse();
    }
    throw error;
  }
}

