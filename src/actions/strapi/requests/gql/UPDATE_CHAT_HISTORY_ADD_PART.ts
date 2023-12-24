import { gql } from "@apollo/client";
import { ChatHistory } from "../../types/chatHistory";

export const UPDATE_CHAT_HISTORY_ADD_PART = gql`
  mutation UpdateChatHistoryAddPart($id: ID!, $data: ChatHistoryInput!) {
  updateChatHistory(id: $id, data: $data) {
    data {
      id
      attributes {
        name
        chat_parts {
          data {
            id
            attributes {
              chat_messages {
                data {
                  attributes {
                    timestamp
                    state
                    message
                    index
                    error_message
                    createdAt
                    updatedAt
                  }
                  id
                }
              }
              index
              role
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
}`;

export interface UpdateChatHistoryResponse {
  updateChatHistory: {
    data: ChatHistory;
  };
}

export interface ChatHistoryInput {
  id: string;
  data: {
    chat_parts: string[];  // Assuming chat_messages are an array of strings (IDs).
  };
}

export interface ChatPartId {
  id: string;
}