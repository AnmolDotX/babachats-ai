import { google } from "@ai-sdk/google";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";

export const myProvider = isTestEnvironment
  ? (() => {
      // Note: Test environment models are loaded from models.mock and will not
      // be affected by the API model name change.
      const { artifactModel, chatModel, reasoningModel, titleModel } =
        require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Updated model across all categories
        "chat-model": google("gemini-2.5-flash"),
        "chat-model-reasoning": google("gemini-2.5-flash-lite"),
        "title-model": google("gemini-2.5-flash"),
        "artifact-model": google("gemini-2.5-flash"),
      },
    });
