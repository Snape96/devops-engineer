import { saveRegeneratedMessageToDatabase } from "@/actions/strapi/chat";
import { ChatHistory } from "@/actions/strapi/types/chatHistory";
import { Dispatch, SetStateAction } from "react";
import { mapConversationToOpenAIInterface } from "./helpers/mapConversationToOpenAIInterface";
import { openSendChatMessageStream } from "./stream/openSendChatMessageStream";

/**
 * Regenerates an existing system message in a chat history.
 * 
 * @param lastHistorySnippet - The last chat history data providing context for the regenerated message.
 * @param setLoading - Function to set loading state.
 * @param setHistory - Function to set chat history.
 * @param setStreamingResponse - Function to set the streaming response in real-time.
 */
export async function regenerateMessage(
  lastHistorySnippet: ChatHistory,
  partIndex: number,
  userId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setHistory: Dispatch<SetStateAction<ChatHistory | undefined>>,
  setStreamingResponse: Dispatch<SetStateAction<string>>
) {
  /**
   * Initiates loading state when the stream starts.
   */
  const onStreamStart = async () => {
    setLoading( true );
  };
  
  /**
   * Appends each token to the streaming response.
   * 
   * @param token - The token to append.
   */
  const onStreamToken = async ( token: string ) => {
    setStreamingResponse( prev => prev + token );
  };
  
  /**
   * Finalizes the regenerated message, updates the chat history, and resets loading and streaming states.
   * 
   * @param completion - The final completion from the model.
   */
  const onStreamCompletion = async ( completion: string ) => {
    const updatedHistory = await saveRegeneratedMessageToDatabase( completion, lastHistorySnippet, partIndex, userId );
  
    setHistory( updatedHistory );
    setStreamingResponse( '' );
    setLoading( false );
  };
  
  // Initiate loading state.
  setLoading( true );
  
  // Prepare context for the GPT model.
  const gptRequestModel = mapConversationToOpenAIInterface( lastHistorySnippet, partIndex );
  
  return await openSendChatMessageStream(
    gptRequestModel,
    lastHistorySnippet.attributes.model ?? "gpt-3.5-turbo",
    onStreamStart,
    onStreamToken,
    onStreamCompletion
  );
}
  