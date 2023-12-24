import { gql } from "@apollo/client";

export const CREATE_CHAT_MESSAGE = gql`
  mutation CreateChatMessage($data: ChatMessageInput!) {
    createChatMessage(data: $data) {
      data {
        id
        attributes {
          index
          message
          state
          timestamp
        }
      }
    }
  }
`;



export type ChatMessageAttributes = {
  index: number;
  message: string;
  state: string;
  timestamp: string;
  user_identity: string;
  model: string;
  role: string;
};
  
export type ChatMessageData = {
  data: {
    attributes: ChatMessageAttributes;
    id: string,
  };
};
  
  export type ChatMessageResponse = {
    createChatMessage: ChatMessageData;
  };
  
  export type ChatMessageVariables = {
    data: ChatMessageAttributes;
  };
  