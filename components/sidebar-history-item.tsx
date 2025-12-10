import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateChatTitle } from "@/app/(chat)/actions";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import type { Chat } from "@/lib/db/schema";
import {
  CheckCircleFillIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  PencilEditIcon,
  ShareIcon,
  TrashIcon,
} from "./icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => {
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibilityType: chat.visibility,
  });

  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState(chat.title);
  const router = useRouter();

  useEffect(() => {
    setTitle(chat.title);
  }, [chat.title]);

  const handleRename = async () => {
    if (title.trim() === "") {
      setTitle(chat.title);
      setIsRenaming(false);
      return;
    }

    try {
      await updateChatTitle({ chatId: chat.id, title });
      setIsRenaming(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to rename chat");
      setTitle(chat.title);
      setIsRenaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setTitle(chat.title);
      setIsRenaming(false);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={
          isActive
            ? "bg-orange-100/70 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 hover:bg-orange-100 dark:hover:bg-orange-900/40 border-l-2 border-orange-500"
            : "hover:bg-orange-50/50 dark:hover:bg-orange-950/30 text-orange-900/70 dark:text-orange-100/70 hover:text-orange-900 dark:hover:text-orange-100"
        }
      >
        {isRenaming ? (
          <div className="flex w-full items-center p-0">
            <input
              autoFocus
              className="w-full bg-transparent px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-orange-400 rounded"
              onBlur={handleRename}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              value={title}
            />
          </div>
        ) : (
          <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
            <span>{title}</span>
          </Link>
        )}
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className="mr-0.5 data-[state=open]:bg-orange-100 dark:data-[state=open]:bg-orange-900/30 data-[state=open]:text-orange-700 dark:data-[state=open]:text-orange-300"
            showOnHover={!isActive}
          >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="bottom"
          className="bg-orange-50 dark:bg-zinc-900 border-orange-200 dark:border-orange-800"
        >
          <DropdownMenuItem
            className="cursor-pointer text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30"
            onSelect={() => setIsRenaming(true)}
          >
            <PencilEditIcon className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30">
              <ShareIcon />
              <span>Share</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-orange-50 dark:bg-zinc-900 border-orange-200 dark:border-orange-800">
                <DropdownMenuItem
                  className="cursor-pointer flex-row justify-between text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30"
                  onClick={() => {
                    setVisibilityType("private");
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <LockIcon size={12} />
                    <span>Private</span>
                  </div>
                  {visibilityType === "private" ? (
                    <CheckCircleFillIcon />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer flex-row justify-between text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30"
                  onClick={() => {
                    setVisibilityType("public");
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <GlobeIcon />
                    <span>Public</span>
                  </div>
                  {visibilityType === "public" ? <CheckCircleFillIcon /> : null}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/30"
            onSelect={() => onDelete(chat.id)}
          >
            <TrashIcon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) {
    return false;
  }
  return true;
});
