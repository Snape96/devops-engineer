import { createChatHistory } from '@/actions/strapi/requests/createChatHistory';
import { ChatContextData } from '@/components/contexts/portal/data/ChatContext';
import { openSendChatMessageStream } from './stream/openSendChatMessageStream';
import { mapConversationToOpenAIInterface } from './helpers/mapConversationToOpenAIInterface';
import { saveNewChatPartPromptToDatabase } from '@/actions/strapi/chat';
import { ChatHistory } from '@/actions/strapi/types/chatHistory';
import { listChatHistoryParts } from '@/actions/strapi/requests/listChatHistoryParts';
import { Dispatch, SetStateAction } from 'react';

/**
 * General function to handle whole process of sending new message, including writing to database and rewrite UI components during stream
 * @param chatContext
 */
export async function sendNewMessage(
  lastHistorySnippet: ChatHistory,
  userMessage: string,
  model: string,
  userId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setHistory: Dispatch<SetStateAction<ChatHistory | undefined>>,
  setUserInput: Dispatch<SetStateAction<string>>,
  setStreamingResponse: Dispatch<SetStateAction<string>>,
  setTempChatMessage: Dispatch<SetStateAction<string>>
) {
  /**
   * Methods to use during stream
   */
  const onStreamStart = async () => {
    // This callback is called on stream start
    // It is usefull for saving first message to db and so on
    setLoading(true);

    const historyId = lastHistorySnippet.id as string;
    const olderParts =
      lastHistorySnippet.attributes.chat_parts.data.map((e) => e.id) ?? [];

    const updatedHistory = await saveNewChatPartPromptToDatabase(
      userMessage,
      historyId,
      olderParts,
      'user',
      userId,
      model
    );

    console.log(
      'Start of stream, history updated: ',
      JSON.stringify(updatedHistory)
    );
  };

  const onStreamToken = async (token: string) => {
    console.log('STREAM TOKEN: ' + token);
    // This callback is called for each token in the stream
    // You can use this to debug the stream or save the tokens to your database
    setStreamingResponse((e) => e + token);
  };

  const onStreamCompletion = async (completion: string) => {
    console.log('STREAM COMPLETE: ' + completion);
    const historyId = lastHistorySnippet.id as string;

    // This callback is called when the stream completes
    // You can use this to save the final completion to your database
    setStreamingResponse(completion);

    // Refresh message parts to not overwrite something
    // This might be improved by handle this part on backend
    const currentParts = await listChatHistoryParts(historyId);

    console.log(`---- Current parts -----: ${currentParts.map((e) => e)}`);

    const updatedHistory = await saveNewChatPartPromptToDatabase(
      completion,
      historyId,
      currentParts,
      'system',
      userId,
      model
    );

    console.log(
      'End of stream, history updated: ',
      JSON.stringify(updatedHistory)
    );

    setHistory(updatedHistory);
    setStreamingResponse('');
    setTempChatMessage('');
    setLoading(false);
  };

  // Start loading
  setLoading(true);

  // Show temp message
  setTempChatMessage(userMessage);

  // Delete message from text field
  setUserInput('');

  // Send request to GPT and update DB in process
  const gptRequestModel = mapConversationToOpenAIInterface(
    lastHistorySnippet,
    userMessage
  );
  return await openSendChatMessageStream(
    gptRequestModel,
    model ?? 'gpt-3.5-turbo',
    onStreamStart,
    onStreamToken,
    onStreamCompletion
  );
}
