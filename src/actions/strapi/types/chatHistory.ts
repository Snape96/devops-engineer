import { UserIdentity } from '../requests/gql/LIST_USER_IDENTITES';
import { ChatPart } from './chatPart';

export interface ChatHistory {
  id: string | null;
  attributes: ChatHistoryAttributes;
}

interface ChatHistoryAttributes {
  name: string;
  model: string;
  updatedAt: string;
  createdAt: string;
  deleted: boolean;
  chat_parts: ChatParts;
  user_identity: { data: UserIdentity };
  shared_by: string;
}

interface ChatParts {
  data: ChatPart[];
}
