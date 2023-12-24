import { gql } from "@apollo/client";
import { ChatHistory } from "../../types/chatHistory";

export const CREATE_CHAT_HISTORY = gql`
  mutation CreateChatHistory($data: ChatHistoryInput!) {
  createChatHistory(data: $data) {
    data {
      id
      attributes {
        name
        model
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

export interface CreateChatHistoryResponse {
  createChatHistory: {
    data: ChatHistory;
  };
}

export interface CreateChatHistoryVariables {
  data: {
    name: string
    model: string;
    user_identity: string;
  };
}

export interface ChatPartId {
  id: string;
}