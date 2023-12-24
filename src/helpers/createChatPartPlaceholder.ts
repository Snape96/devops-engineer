import { ChatPart } from "@/actions/strapi/types/chatPart";

export function createChatPartPlaceholder( text: string ): ChatPart {
    return {
      id: "-1",
      attributes: {
        chat_messages: {
          data: [
            {
              id: "-1",
              attributes: {
                createdAt: new Date().toISOString(),
                index: 0,
                message: text,
                state: "success",
                timestamp: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            }
          ]
        },
        index: 0,
        role: 'user',
      },
    };
  }