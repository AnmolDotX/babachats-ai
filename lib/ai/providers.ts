import { google } from '@ai-sdk/google';
import { customProvider } from 'ai';
import { isTestEnvironment } from '../constants';

// RECOMMENDED FIX: Changing the model identifier from the retired 'gemini-1.5-pro-latest' 
// to the stable and highly capable 'gemini-2.5-flash' to fix the 404 error.
const STABLE_MODEL = 'gemini-2.5-flash';

export const myProvider = isTestEnvironment
  ? (() => {
      // Note: Test environment models are loaded from models.mock and will not
      // be affected by the API model name change.
      const { artifactModel, chatModel, reasoningModel, titleModel } =
        require('./models.mock');
      return customProvider({
        languageModels: {
          'chat-model': chatModel,
          'chat-model-reasoning': reasoningModel,
          'title-model': titleModel,
          'artifact-model': artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Updated model across all categories
        'chat-model': google(STABLE_MODEL),
        'chat-model-reasoning': google(STABLE_MODEL),
        'title-model': google(STABLE_MODEL),
        'artifact-model': google(STABLE_MODEL),
      },
    });
