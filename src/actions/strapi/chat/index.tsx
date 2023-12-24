import { createChatHistory } from '../requests/createChatHistory';
import { createChatMessage } from '../requests/createChatMessage';
import { createChatPart } from '../requests/createChatPart';
import { getChatHistory } from '../requests/getChatHistory';
import { updateChatHistoryAddPart } from '../requests/updateChatHistoryAddPart';
import { updateChatPartAddMessage } from '../requests/updateChatPartAddMessage';
import { ChatHistory } from '../types/chatHistory';


export const saveNewHistoryToDatabase = async (model: string, user_identity: string) => {
    const historyRes = await createChatHistory( '', model, user_identity );
    if ( historyRes ) {
        return historyRes;
    };
};

export const saveNewChatPartPromptToDatabase = async ( message: string, historyId: string, olderParts: string[], role: "function" | "system" | "user" | "assistant", userId: string, model: string  ) => {
    const messageRes = await createChatMessage( message, 0, userId, model, role );
    if ( messageRes ) {
        const partRes = await createChatPart( olderParts.length, role, [messageRes?.data.id], userId );
        if ( partRes ) {
            const historyRes = await updateChatHistoryAddPart( historyId, olderParts, partRes.createChatPart.data.id as string );
            if ( historyRes ) {
                console.log( `History updated! ${ historyRes.id }` );
                return historyRes;
            }
            else {
                throw new Error( "History wasnt updated" );    
            }
        }
        else {
            throw new Error( "Part wasnt created" );    
        }
    }
    else {
        throw new Error( "Message wasnt created" );
    }
};

/**
 * Save a regenerated system message to a specified ChatPart.
 * 
 * @param completion The content of the message
 * @param lastHistorySnippet The most recent ChatHistory
 * @param partIndex Index of the ChatPart to update
 * 
 * @returns Updated ChatHistory object
 * @throws Error if any database operation fails or index is invalid
 */
export const saveRegeneratedMessageToDatabase = async (
    completion: string, 
    lastHistorySnippet: ChatHistory, 
    partIndex: number,
    userId: string
  ): Promise<ChatHistory> => {
    
    // Validate partIndex
    if (partIndex < 0 || partIndex >= lastHistorySnippet?.attributes.chat_parts?.data.length) {
      throw new Error(`Invalid part index ${partIndex}`);
    }

    const part = lastHistorySnippet.attributes.chat_parts.data[partIndex];
  
    // Create ChatMessage
    const messageRes = await createChatMessage(completion, part.attributes.chat_messages.data.length, userId, lastHistorySnippet.attributes.model, part.attributes.role);
    if (!messageRes) throw new Error('Message not created');
  
    // Get partId and update ChatPart
    console.log('before update part res')
    const partRes = await updateChatPartAddMessage(part, messageRes.data.id);
    if (!partRes) throw new Error('Part not updated');
    console.log( 'after update part res' )

    console.log('before update history')
    // Refresh and return updated ChatHistory
    const updatedHistory = await getChatHistory(lastHistorySnippet.id as string, true);
    if (!updatedHistory) throw new Error('History not updated');
    console.log('after update history')

    return updatedHistory;
  }
  