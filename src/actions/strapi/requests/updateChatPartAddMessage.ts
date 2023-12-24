import { ChatPart } from "../types/chatPart";
import { strapiClient } from "./apollo/apollo-client";
import {
  ChatPartInput,
  UPDATE_CHAT_PART_ADD_MESSAGE, UpdateChatPartAddMessageResponse,
} from "./gql/UPDATE_CHAT_PART_ADD_MESSAGE";

/**
 * Updates an existing ChatPart by adding a new message to the chat_messages field.
 *
 * @param {ChatPart} part - Part to update.
 * @param {string} messageId - The ID of the ChatMessage to add.
 * @returns {Promise<UpdateChatPartAddMessageResponse | undefined>} Resolves to the GraphQL response or undefined.
 * @throws {Error} Throws an error if the GraphQL mutation fails or if inputs are invalid.
 */
export async function updateChatPartAddMessage(
  part: ChatPart,
  messageId: string
): Promise<ChatPart | undefined> {
  // Validate inputs
  if (!part || !messageId) {
    throw new Error("Invalid inputs: id and messageId must be non-empty strings.");
  }

    // Append the new messageId to the existing chat_messages
    const messagesInPart = [...part.attributes.chat_messages.data.map( e => e.id ), messageId];
    
  try {
    const { data } = await strapiClient.mutate<UpdateChatPartAddMessageResponse, ChatPartInput>({
      mutation: UPDATE_CHAT_PART_ADD_MESSAGE,
      variables: { id: part.id, data: { chat_messages: messagesInPart }},
    });

    return data?.updateChatPart.data;
  } catch (error) {
    throw new Error(`Failed to update chat part: ${error}`);
  }
}
