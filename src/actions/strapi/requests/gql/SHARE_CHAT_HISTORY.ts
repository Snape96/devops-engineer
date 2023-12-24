import { gql } from "@apollo/client";

export const SHARE_CHAT_HISTORY = gql`
  mutation CloneChatHistory($originalChatHistoryId: String!, $newUserEmail: String!) {
  cloneChatHistory(originalChatHistoryId: $originalChatHistoryId, newUserEmail: $newUserEmail)
}`;

export interface ShareChatHistoryResponse {
    cloneChatHistory: string;
}

export interface ShareChatHistoryInput {
    originalChatHistoryId: string;
    newUserEmail: string
}