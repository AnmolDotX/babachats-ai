import { auth } from "@/app/(auth)/auth";
import { ChatSDKError } from "@/lib/errors";

// Stream resumption endpoint - disabled (Redis/resumable-stream removed)
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: chatId } = await params;

  if (!chatId) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  // Resumable streams are no longer available (Redis removed)
  // Return 204 No Content to indicate stream resumption is not supported
  return new Response(null, { status: 204 });
}
