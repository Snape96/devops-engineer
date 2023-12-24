import { gql } from "@apollo/client";
import { ChatHistory } from "../../types/chatHistory";

export const UPDATE_CHAT_HISTORY_RENAME = gql`
  mutation UpdateChatHistoryAddPart($id: ID!, $data: ChatHistoryInput!) {
  updateChatHistory(id: $id, data: $data) {
    data {
      id
      attributes {
        name
      }
    }
  }
}`;

export interface RenameChatHistoryResponse {
  updateChatHistory: {
    data: ChatHistory;
  };
}

export interface ChatHistoryInput {
  id: string;
  data: {
    name: string; 
  };
}