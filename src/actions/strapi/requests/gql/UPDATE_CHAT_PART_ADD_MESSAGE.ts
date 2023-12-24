import { gql } from "@apollo/client";
import { ChatPart } from "../../types/chatPart";

/**
 * GraphQL mutation to update a chat part by adding a new message.
 * @param $id - The ID of the chat part to update.
 * @param $data - The new data to append to the chat part.
 */
export const UPDATE_CHAT_PART_ADD_MESSAGE = gql`
  mutation UpdateChatPartAddMessage($id: ID!, $data: ChatPartInput!) {
    updateChatPart(id: $id, data: $data) {
      data {
        id
        attributes {
          index
          role
          chat_messages {
            data {
              id
              attributes {
                createdAt
                error_message
                index
                message
                state
                timestamp
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Interface to represent individual Chat Message ID.
 */
export interface ChatMessageId {
  id: string;
}

/**
 * Interface to represent the expected response shape of UpdateChatPartAddMessage.
 * The response contains the updated ChatPart object.
 */
export interface UpdateChatPartAddMessageResponse {
  updateChatPart: {
    data: ChatPart
  };
}

/**
 * Interface to define the structure of the variables for UpdateChatPartAddMessage.
 * @field id - The ID of the chat part to update.
 * @field data - Contains an array of chat message IDs to add to the chat part.
 */
export interface ChatPartInput {
  id: string;
  data: {
    chat_messages: string[];  // Assuming chat_messages are an array of strings (IDs).
  };
}
