import { gql } from "@apollo/client";

export const LIST_CHAT_HISTORIES = gql`
  query ListChatHistories($sort: [String], $filters: ChatHistoryFiltersInput) {
    chatHistories(sort: $sort, filters: $filters) {
      data {
        id
        attributes {
          name
          updatedAt
          createdAt
          shared_by
        }
      }
    }
  }
`;

export interface ListChatHistoryAttributes {
  name: string;
  updatedAt: Date;
  createdAt: Date;
  shared_by: string;
}

export interface ListChatHistoryData {
  id: string;
  attributes: ListChatHistoryAttributes;
}

export interface ListChatHistoriesResponse {
  chatHistories: { data: ListChatHistoryData[]; }
}

export interface ChatHistoryFiltersInput {
  sort: string[];
  filters: {
    and: [
      {
        user_identity: {
          id: {
            eq: string;
          };
        };
      },
      {
        deleted: {
          eq: false
        }
      }
    ]
    ;
  };
}
