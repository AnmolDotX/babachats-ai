export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Smart",
    description: "For quick and simple tasks",
  },
  {
    id: "chat-model-reasoning",
    name: "Reasoning",
    description:
      "For complex maths, code and reasoning tasks",
  },
];
