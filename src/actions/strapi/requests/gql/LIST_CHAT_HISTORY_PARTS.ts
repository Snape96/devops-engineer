import { gql } from '@apollo/client';

export const LIST_CHAT_HISTORY_PARTS = gql`
  query LIST_CHAT_HISTORY_PARTS($id: ID) {
    chatHistory(id: $id) {
      data {
        attributes {
          chat_parts {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export interface ChatPartId {
  id: string;
}

export interface ChatPartsIdsData {
  data: ChatPartId[];
}

export interface ListChatHistoryPartsAttributes {
  chat_parts: ChatPartsIdsData;
}

export interface ChatHistoryPartsListData {
  attributes: ListChatHistoryPartsAttributes;
}

export interface ChatHistoryPartsList {
  data: ChatHistoryPartsListData;
}

export interface ChatHistoryPartsListResponse {
  chatHistory: ChatHistoryPartsList;
}

export interface ChatHistoryPartsListVariables {
  id: string;
}