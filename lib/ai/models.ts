export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Gemini Pro",
    description: "Google's Gemini 1.5 Pro model for advanced AI capabilities",
  },
  {
    id: "chat-model-reasoning",
    name: "Gemini Reasoning",
    description:
      "Gemini with chain-of-thought reasoning for complex problem solving",
  },
];
