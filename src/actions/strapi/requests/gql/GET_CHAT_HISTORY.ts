import { gql } from '@apollo/client';
import { ChatHistory } from '../../types/chatHistory';

export const GET_CHAT_HISTORY = gql`
  query GetChatHistory($id: ID) {
    chatHistory(id: $id) {
      data {
        attributes {
          chat_parts {
            data {
              id
              attributes {
                role
                index
                chat_messages {
                  data {
                    attributes {
                      createdAt
                      error_message
                      index
                      message
                      state
                      timestamp
                      updatedAt
                    }
                    id
                  }
                }
              }
            }
          }
          createdAt
          name
          deleted
          model
          updatedAt
          shared_by
          user_identity {
            data {
              id
            }
          }
        }
        id
      }
    }
  }
`;

export interface GetChatHistoryVariables {
  id: string;
}

export interface GetChatHistoryResponse {
  chatHistory: { data: ChatHistory };
}
