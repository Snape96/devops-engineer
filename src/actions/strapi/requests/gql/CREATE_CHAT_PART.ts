import { gql } from "@apollo/client";
import { ChatHistory } from "../../types/chatHistory";

export const CREATE_CHAT_PART = gql`
  mutation CreateChatPart($data: ChatPartInput!) {
    createChatPart(data: $data) {
      data {
        id
        attributes {
          index
          role
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
  }
`;
  
  export interface ChatPartResponse {
    createChatPart: {
      data: ChatHistory;
    }
  }


  export interface ChatPartInput {
    data: {
      index: number;
      role: string;
      chat_messages: string[];  // Assuming chat_messages are an array of strings (IDs).
      user_identity: string;
    };
  }