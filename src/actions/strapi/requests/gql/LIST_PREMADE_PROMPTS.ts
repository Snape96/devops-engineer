import { gql } from '@apollo/client';

export const LIST_PREMADE_PROMPTS = gql`
  query ListPremadePromps($sort: [String]) {
    premadePrompts(sort: $sort) {
      data {
        id
        attributes {
          name
          description
          prompt
          updatedAt
          createdAt
        }
      }
    }
  }
`;

export interface ListPremadePromptsAttributes {
  name: string;
  description: string;
  prompt: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ListPremadePromptsData {
  id: string;
  attributes: ListPremadePromptsAttributes;
}

export interface ListPremadePromptsResponse {
  premadePrompts: { data: ListPremadePromptsData[] };
}
