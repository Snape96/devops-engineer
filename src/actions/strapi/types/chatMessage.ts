export interface ChatMessage {
    id: string;
    attributes: ChatMessageAttributes;
  }

interface ChatMessageAttributes {
    createdAt: string;
    error_message?: string | null;
    index: number;
    message?: string | null;
    state: 'success' | 'fail';
    timestamp: string;
    updatedAt: string;
  }
