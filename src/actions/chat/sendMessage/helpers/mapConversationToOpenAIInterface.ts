import { ChatHistory } from "@/actions/strapi/types/chatHistory";
import { ChatCompletionRequestMessage } from "openai-edge";

// Function signature overloads
/**
 * Map a chat conversation history to OpenAI's API interface when a new message string is provided.
 *
 * @param history - Chat history, may be undefined if the conversation hasn't started.
 * @param newMessage - A new message as a string.
 * @returns An array of messages conforming to the ChatCompletionRequestMessage interface.
 */
export function mapConversationToOpenAIInterface(history: ChatHistory | undefined, newMessage: string): ChatCompletionRequestMessage[];

/**
 * Map a chat conversation history to OpenAI's API interface when the last message index is provided.
 *
 * @param history - Chat history, may be undefined if the conversation hasn't started.
 * @param lastMessageIndex - The index of the last message in the chat history.
 * @returns An array of messages conforming to the ChatCompletionRequestMessage interface.
 */
export function mapConversationToOpenAIInterface(history: ChatHistory | undefined, lastMessageIndex: number): ChatCompletionRequestMessage[];

/**
 * Map a chat conversation history to OpenAI's API interface. Overloaded to accept either a new message or 
 * a last message index.
 *
 * @param history - Chat history, may be undefined if the conversation hasn't started.
 * @param messageOrIndex - A new message as a string, or the last message index as a number.
 * @returns An array of messages conforming to the ChatCompletionRequestMessage interface.
 */
export function mapConversationToOpenAIInterface(
    history: ChatHistory | undefined,
    messageOrIndex: string | number
  ): ChatCompletionRequestMessage[] {
    
    if (typeof messageOrIndex === 'string') {
      return mapString(history, messageOrIndex);
    } else if (typeof messageOrIndex === 'number') {
        return mapUntilPartWithGivenIndex( history, messageOrIndex );
    } else {
      throw new Error('Invalid type for messageOrIndex');
    }
  }
  
  /**
   * Handles the mapping logic when a new message string is provided.
   *
   * @param history - Chat history, may be undefined.
   * @param newMessage - A new message as a string.
   * @returns An array of messages with successful status.
   */
  function mapString(history: ChatHistory | undefined, newMessage: string): ChatCompletionRequestMessage[] {
    const parts = history?.attributes.chat_parts?.data ?? [];
    const successMessages: ChatCompletionRequestMessage[] = [];
  
    for (const part of parts) {
      const lastSuccessMessage = part.attributes.chat_messages.data.findLast(
        e => e.attributes.state === 'success' && e.attributes.message
      );
      if (lastSuccessMessage) {
        successMessages.push({ content: lastSuccessMessage.attributes.message as string, role: part.attributes.role });
      }
    }
    
    return [...successMessages, { content: newMessage, role: 'user' }];
}
  
/**
 * Maps the chat history up to a given message index, collecting all successfully processed messages.
 * 
 * @param history - The chat history object, which may be undefined.
 * @param lastMessageIndex - The index up to which the function will look for successful messages.
 * 
 * @throws {Error} Throws an error if there is no chat part with the provided index or if the chat history is undefined.
 * 
 * @returns {ChatCompletionRequestMessage[]} - An array of messages that have been successfully processed.
 * 
 * @example
 * 
 * const chatHistory: ChatHistory = getChatHistorySomehow();
 * const lastIdx = 3;
 * const successfulMessages = mapUntilPartWithGivenIndex(chatHistory, lastIdx);
 * 
 */
function mapUntilPartWithGivenIndex(history: ChatHistory | undefined, lastMessageIndex: number): ChatCompletionRequestMessage[] {
    // Check if a chat history and chat part with the provided index exists
    if (!history || !history.attributes.chat_parts.data[lastMessageIndex])
        throw new Error(`No message part with index ${lastMessageIndex} in history ${history?.id}`);

    // Initialize an array to hold successfully processed messages
    const successMessages: ChatCompletionRequestMessage[] = [];
    
    // Loop through the chat history up to the specified index
    for (let i = 0; i <= lastMessageIndex; i++) {
        // Get the chat part at the lastMessageIndex
        const part = history.attributes.chat_parts.data[i];
        
        // Find the last successfully processed message in the chat part
        const lastSuccessMessage = part.attributes.chat_messages.data.findLast(e => e.attributes.state === 'success');

        // If a successful message is found, add it to the array
        if (lastSuccessMessage) {
            successMessages.push({ content: lastSuccessMessage.attributes.message as string, role: part.attributes.role });
        }
    }

    // Return the array of successfully processed messages
    return successMessages;
}
