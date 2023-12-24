import { ChatMessage } from "./chatMessage";

export interface ChatPart {
    id: string;
    attributes: ChatPartAttributes;
}

interface ChatPartAttributes {
    chat_messages: ChatMessages;
    index: number;
    role: 'system' | 'user' | 'assistant' | 'function';
}

  
interface ChatMessages {
    data: ChatMessage[];
}