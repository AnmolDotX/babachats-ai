"use client";

import type { Session } from "next-auth";
import { startTransition, useMemo, useOptimistic, useState } from "react";
import { saveChatModelAsCookie } from "@/app/(chat)/actions";
import { Button } from "@/components/ui/button";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { chatModels } from "@/lib/ai/models";
import { cn } from "@/lib/utils";

export function ModelSelector({
  session,
  selectedModelId,
  className,
}: {
  session: Session;
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  const userType = session.user.type;
  const { availableChatModelIds } = entitlementsByUserType[userType];

  const availableChatModels = chatModels.filter((chatModel) =>
    availableChatModelIds.includes(chatModel.id)
  );

  const selectedChatModel = useMemo(
    () =>
      availableChatModels.find(
        (chatModel) => chatModel.id === optimisticModelId
      ),
    [optimisticModelId, availableChatModels]
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {availableChatModels.map((chatModel) => (
        <Button
          className={cn(
            "h-8 px-3 font-medium text-sm transition-colors",
            optimisticModelId === chatModel.id
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          data-testid={`model-selector-${chatModel.id}`}
          key={chatModel.id}
          onClick={() => {
            startTransition(() => {
              setOptimisticModelId(chatModel.id);
              saveChatModelAsCookie(chatModel.id);
            });
          }}
          variant={optimisticModelId === chatModel.id ? "secondary" : "ghost"}
        >
          {chatModel.name}
        </Button>
      ))}
    </div>
  );
}
