import type { UserType } from "@/app/(auth)/auth";
import type { ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: parseInt(process.env.NEXT_PUBLIC_GUEST_MESSAGE_LIMIT ?? "5", 10),
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: parseInt(process.env.NEXT_PUBLIC_FREE_MESSAGE_LIMIT ?? "100", 10),
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
