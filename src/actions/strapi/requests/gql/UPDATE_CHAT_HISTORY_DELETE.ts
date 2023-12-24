import { gql } from "@apollo/client";
import { ChatHistory } from "../../types/chatHistory";

export const UPDATE_CHAT_HISTORY_DELETE = gql`
  mutation UpdateChatHistoryDelete($id: ID!, $data: ChatHistoryInput!) {
  updateChatHistory(id: $id, data: $data) {
    data {
      id
    }
  }
}`;

export interface DeleteChatHistoryResponse {
  updateChatHistory: {
    data: { id: string };
  };
}

export interface ChatHistoryInput {
  id: string;
  data: {
    deleted: boolean; 
  };
}