import { ChatCompletionRequestMessage } from "openai-edge";
import { openSendChatMessageStream } from "./sendMessage/stream/openSendChatMessageStream";
import { NAME_CONVERSATION_PROMPT } from './sendMessage/helpers/NAME_CONVERSATION_PROMPT';
import { updateChatHistoryRename } from "../strapi/requests/updateChatHistoryRename";

export async function nameChatHistory(
    firstMessage: string,
    historyId: string,
    refreshChatHistories: () => Promise<void>
) {
    /**
     * Methods to use during stream
     */
    const onStreamStart = async () => {
    };
    
    const onStreamToken = async ( token: string ) => {
    };
    
    const onStreamCompletion = async ( completion: string ) => {
        const res = await updateChatHistoryRename( historyId, completion );
        console.log( `History ${ res?.id } renamed: `, res?.attributes.name );
        await refreshChatHistories();
    };
    
    const messages: ChatCompletionRequestMessage[] = [
        {
            role: 'system',
            content: NAME_CONVERSATION_PROMPT
        },
        {
            role: 'user',
            content: firstMessage
        }
    ]

    // Send request to GPT and update DB in process
    return await openSendChatMessageStream(
        messages,
        "gpt-3.5-turbo",
        onStreamStart,
        onStreamToken,
        onStreamCompletion
    );
};
